/* Module 15 — storage layout picker and end-to-end boot walkthrough */
(function () {
  const { $, picker, stepper } = window.SBA;

  picker($("#store-pick"), {
    bl: { title: "bl_a / bl_b — first bootloader", tags: [["LUN 0"], ["SoC vendor", "red"]],
      html: `<p>Loaded and verified by the boot ROM. Initialises DDR and clocks, then loads TF-A, the trusted OS and the QNX host image from the active slot. Delivered by the SoC vendor; signed with the OEM key whose hash is fused.</p>` },
    tfa: { title: "tfa_a / tfa_b — secure world", tags: [["TF-A"], ["TEE"]],
      html: `<p>Secure monitor (EL3) and trusted OS. Provides PSCI power management, secure storage and keys for Android's Keymint/Gatekeeper (via the hypervisor's secure-call forwarding).</p>` },
    fwcfg: { title: "fw_cfg — system slot & device info", tags: [["control"]],
      html: `<p>System-wide boot control: active slot for firmware and host, boot-attempt counters, device identity. The OTA orchestrator switches slots here (15.7).</p>` },
    hyp: { title: "hyp_a / hyp_b — QNX host image", tags: [["LUN 1"], ["Module 11", "blue"]],
      html: `<p><code>hyp_host.ifs</code>: startup, kernel with the qvm module, host drivers and services, qvm configs — and the small guests embedded in it: <code>cluster.ifs</code>, the guest U-Boot and the Linux kernel <code>Image</code>.</p>` },
    assets: { title: "cluster_assets_a/b", tags: [["qnx6fs"], ["Module 12", "amber"]],
      html: `<p>Fonts, 3D models and textures for the cluster HMI, exported to the cluster VM as a read-only virtio disk. A/B so HMI updates follow the system slot.</p>` },
    qnxdata: { title: "qnx_data", tags: [["rw"]],
      html: `<p>Host logs, crash dumps of guests, calibration data. Not part of the OTA.</p>` },
    aboot: { title: "Android boot chain partitions", tags: [["LUN 2"], ["A/B", "green"]],
      html: `<p><code>boot</code>, <code>init_boot</code>, <code>vendor_boot</code>, <code>vbmeta</code> and <code>vbmeta_system</code>, each with <code>_a/_b</code>. Read by the guest U-Boot over virtio-blk. Sizes must match <code>BOARD_*_PARTITION_SIZE</code> (Module 13.4).</p>` },
    asuper: { title: "super", tags: [["dynamic partitions"], ["8 GiB", "green"]],
      html: `<p>All Android logical partitions. Its size is the most important number in the whole layout: it must equal <code>BOARD_SUPER_PARTITION_SIZE</code> and leave room for growth over the vehicle's life.</p>` },
    actl: { title: "misc & metadata", tags: [["Android control"]],
      html: `<p><code>misc</code> carries the Android A/B slot metadata shared by the Boot HAL and the guest U-Boot; <code>metadata</code> holds encryption keys and Virtual A/B snapshot state.</p>` },
    adata: { title: "userdata", tags: [["f2fs"], ["encrypted", "green"]],
      html: `<p>Apps and per-user data. Takes the rest of the LUN. Wiped only on factory reset.</p>` },
    lroot: { title: "linux_rootfs_a / _b", tags: [["LUN 3"], ["Module 14", "purple"]],
      html: `<p>The read-only, SELinux-labelled ext4 root file system from Yocto. Updated A/B by the orchestrator; optionally protected by dm-verity.</p>` },
    ldata: { title: "linux_data", tags: [["rw"]],
      html: `<p>Persistent state for Linux services: OTA downloads, telematics configuration, logs.</p>` },
  }, "asuper");

  stepper($("#boot-stepper"), {
    target: $("#boot-diagram"),
    intro: "Press <b>Next ▶</b> to start the car. Timings are typical targets for a cold boot.",
    steps: [
      { title: "Ignition: the MCU wakes the SoC", who: "t = 0 ms · MCU", hl: ["mcu"], tags: [["power"]],
        html: `<p>The always-on vehicle MCU sees ignition (or door unlock), enables the SoC power rails and releases reset.</p>` },
      { title: "Boot ROM verifies the bootloader", who: "~ 20 ms · ROM", hl: ["rom"], tags: [["secure boot", "red"]],
        html: `<p>Mask ROM code reads <code>bl_a</code> or <code>bl_b</code> from the boot LUN and checks its signature against the fused key hash. Failure → try the other slot or stop.</p>` },
      { title: "Bootloader loads secure world and host", who: "~ 150 ms · bootloader", hl: ["bl"], tags: [["DDR init"], ["verify hyp", "red"]],
        html: `<p>Initialises DDR, may show a static splash on the cluster panel, loads and verifies TF-A, the trusted OS and <code>hyp_a/b</code> according to <code>fw_cfg</code>.</p>` },
      { title: "TF-A & TEE start, jump to the hypervisor", who: "~ 200 ms · EL3 → EL2", hl: ["tfa"], tags: [["PSCI"]],
        html: `<p>The secure monitor and trusted OS initialise, then control passes to QNX's <code>startup-acmesoc</code> at the hypervisor exception level.</p>` },
      { title: "QNX host comes up", who: "~ 350 ms · host", hl: ["host"], tags: [["procnto + qvm"]],
        html: `<p>The microkernel starts and runs the host script: console, SMMU manager, UFS driver, vehicle gateway, health monitor.</p>`,
        code: `# host slog (illustrative)
startup-acmesoc: 12 cpus, 16384 MB
procnto: qvm module present
devb-ufs-acmesoc: /dev/ufs0..3 ready
acme-vehicle-gateway: MCU link up (SPI1)`, lang: "conf" },
      { title: "Cluster VM: telltales on screen", who: "< 1 s · cluster", hl: ["host", "cluster"], tags: [["deadline < 2 s", "amber"]],
        html: `<p>The first qvm starts the cluster guest. A minimal renderer shows telltales and speed from the first vehicle signals; the full HMI fades in a moment later.</p>` },
      { title: "Linux SE VM: network & gateway", who: "~ 3 s · Linux", hl: ["host", "linux"], tags: [["systemd"], ["SELinux enforcing", "purple"]],
        html: `<p>The Linux kernel (embedded in the host image) mounts the read-only rootfs, loads the SELinux policy and starts the firewall, telematics and diagnostic gateway.</p>` },
      { title: "Android VM: guest U-Boot verifies and loads", who: "~ 2.5 s · Android", hl: ["host", "android"], tags: [["A/B from misc"], ["AVB", "amber"]],
        html: `<p>The third qvm runs U-Boot inside the guest. It reads the A/B metadata from <code>misc</code>, verifies <code>vbmeta</code> with the embedded AVB key, loads <code>boot</code>, <code>init_boot</code> and <code>vendor_boot</code>, builds bootconfig and starts the kernel.</p>`,
        code: `# guest U-Boot config fragment
CONFIG_VIRTIO_MMIO=y
CONFIG_VIRTIO_BLK=y
CONFIG_ANDROID_AB=y
CONFIG_LIBAVB=y
CONFIG_AVB_VERIFY=y
CONFIG_BOOTMETH_ANDROID=y`, lang: "conf" },
      { title: "Android first-stage init", who: "~ 4 s · Android", hl: ["android"], tags: [["vendor_ramdisk modules"], ["dm-verity", "amber"]],
        html: `<p>Loads virtio modules from the vendor ramdisk, finds the disk named by <code>androidboot.boot_devices</code>, maps the logical partitions inside <code>super</code> and mounts them with dm-verity using the hashtree roots from <code>vbmeta</code>.</p>` },
      { title: "Zygote, system_server, CarService", who: "~ 10 s · Android", hl: ["android", "host"], tags: [["VHAL ↔ vsock"]],
        html: `<p>Second-stage init starts HALs in the <code>early_hal</code> class — the VHAL bridge connects to the host gateway over vsock — then Zygote, system_server and CarService. Early-RVC handover to Android's EVS can happen from here on.</p>` },
      { title: "Home screen & map on the cluster", who: "~ 15–20 s · all", hl: ["android", "cluster", "linux", "host"], tags: [["done", "green"]],
        html: `<p>The launcher is up on the center display; the navigation app streams map frames to the cluster through shared memory. In production, suspend-to-RAM hides most of this on every drive after the first.</p>` },
    ],
  });
})();
