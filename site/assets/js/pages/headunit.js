/* Module 10 — clickable head-unit SoC */
(function () {
  const { $, picker } = window.SBA;
  picker($("#soc-pick"), {
    cluster: {
      title: "Cluster VM — QNX guest",
      tags: [["QNX Neutrino"], ["safety-relevant", "amber"], ["Module 12", "gray"]],
      html: `<p>Draws the instrument cluster: speed, telltales, warnings and chimes, and often a fallback for the rear-view camera. Runs on dedicated, pinned cores with guaranteed memory so Android's load cannot starve it.</p>
        <ul><li>Boots in about a second, long before Android.</li><li>Receives vehicle signals from the host's vehicle gateway.</li><li>May show navigation content rendered by Android through shared memory.</li></ul>`,
    },
    android: {
      title: "Android VM — Android Automotive OS",
      tags: [["AAOS"], ["Soong build", "green"], ["Module 13", "gray"]],
      html: `<p>The infotainment system: launcher, media, navigation, phone, settings and third-party apps. Built with Soong from AOSP plus your device tree. Sees virtual disks and devices; vehicle data arrives through a VHAL implementation that forwards to the host over vsock.</p>`,
    },
    linux: {
      title: "Linux SE VM — security-enhanced Linux services",
      tags: [["Yocto"], ["SELinux enforcing", "purple"], ["Module 14", "gray"]],
      html: `<p>A small, hardened Linux that owns the connection to the outside world and back-end services: telematics, V2X, OTA download &amp; orchestration, firewall and diagnostic gateway. Keeping these out of Android shrinks the attack surface of the infotainment VM.</p>
        <p class="small muted">“Linux SE” in this handbook means a Yocto-built Linux guest with SELinux enforcing. Some programs use the term for a different service VM — the build flow is the same.</p>`,
    },
    ivc: {
      title: "Inter-VM communication",
      tags: [["virtio"], ["vsock"], ["shmem"]],
      html: `<p>VMs share nothing by default. The hypervisor provides explicit channels: virtual network links, vsock sockets and shared-memory regions with doorbell interrupts. Every channel is configured in the qvm configuration files (Module 11.6).</p>`,
    },
    host: {
      title: "QNX Hypervisor host",
      tags: [["Type 1"], ["QNX Neutrino microkernel", "blue"], ["Module 11", "gray"]],
      html: `<p>A QNX system whose microkernel includes the hypervisor extensions. It boots first, starts drivers for the hardware it owns (storage, display controller, GPU, audio DSP, MCU link), then launches one <code>qvm</code> process per guest. Each qvm reads a configuration file describing the guest's RAM, vCPUs and virtual devices.</p>`,
      code: `qvm @/etc/qvm/cluster.qvmconf &
qvm @/etc/qvm/linux.qvmconf &
qvm @/etc/qvm/android.qvmconf &`,
    },
    fw: {
      title: "Firmware & secure boot chain",
      tags: [["SoC vendor"], ["signed", "red"], ["Module 15.2", "gray"]],
      html: `<p>The boot ROM verifies the first bootloader with a key fused into the chip; each stage verifies the next — bootloader, TF-A/secure monitor, trusted OS, then the QNX hypervisor image. Usually delivered as signed binaries by the SoC vendor; you sign the parts you own.</p>`,
    },
    cpu: { title: "CPU cores", tags: [["scheduling"]], html: `<p>vCPUs are host threads. Pin the cluster's vCPUs to dedicated cores and give the host's own threads higher priority than any guest. Android gets the remaining big cores.</p>` },
    gpu: { title: "GPU & displays", tags: [["vendor-specific"]], html: `<p>The host owns the GPU and display controller. Guests use para-virtualised or hardware-assisted GPU contexts provided by the SoC vendor's graphics stack, and each display pipe is assigned to one VM — cluster panel to the cluster, center and passenger panels to Android.</p>` },
    ufs: { title: "Storage", tags: [["GPT"], ["virtio-blk"]], html: `<p>The host's storage driver owns UFS/eMMC. Each guest partition is exported as a virtio-blk device, so Android sees “disks” named <code>super</code>, <code>userdata</code>… and never touches QNX's partitions. Layout in Module 15.1.</p>` },
    io: { title: "Peripherals", tags: [["pass-through"]], html: `<p>USB, Wi-Fi and Bluetooth are usually passed through to Android (users plug phones in); an automotive Ethernet port may be passed to Linux SE. Pass-through requires SMMU protection (Module 11.7).</p>` },
    mcu: { title: "Vehicle MCU", tags: [["AUTOSAR"], ["CAN · LIN"]], html: `<p>A separate real-time controller that owns the vehicle buses and power. The host talks to it over SPI/UART/Ethernet and redistributes signals: speed and telltales to the cluster, properties to Android's VHAL, diagnostics to Linux SE.</p>` },
  }, "host");
})();
