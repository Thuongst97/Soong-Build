/* Module 11 — annotated host buildfile */
(function () {
  const { $, renderCodeExplorer } = window.SBA;
  renderCodeExplorer($("#buildfile-explorer"), {
    lang: "conf",
    file: "qnx/host/build/hyp_host.build",
    label: "mkifs buildfile",
    src: `
# QNX Hypervisor host image (illustrative)
[image=0x80000000]                                                «1»
[virtual=aarch64le,elf +compress] .bootstrap = {
    startup-acmesoc -v                                            «2»
    [module=qvm] PATH=/proc/boot LD_LIBRARY_PATH=/proc/boot procnto-smp-instr -v   «3»
}

[+script] .script = {                                             «4»
    procmgr_symlink ../../proc/boot/ldqnx-64.so.2 /usr/lib/ldqnx-64.so.2
    display_msg "Acme HU: hypervisor host"
    slogger2 -s 4096 &
    pipe &

    devc-seracmesoc -e -b115200 &                                 «5»
    reopen /dev/ser1

    smmuman &                                                     «6»
    devb-ufs-acmesoc partitions=gpt &
    waitfor /dev/ufs0 10

    acme-health-monitor &                                         «7»
    acme-vehicle-gateway -d /dev/spi1 &

    qvm @/etc/qvm/cluster.qvmconf &                               «8»
    qvm @/etc/qvm/linux.qvmconf &
    qvm @/etc/qvm/android.qvmconf &
}

# files placed in the image                                       «9»
[perms=0444] /etc/qvm/cluster.qvmconf = qvm/cluster.qvmconf
[perms=0444] /etc/qvm/linux.qvmconf   = qvm/linux.qvmconf
[perms=0444] /etc/qvm/android.qvmconf = qvm/android.qvmconf
/guests/cluster/cluster.ifs = ../cluster/out/cluster.ifs          «10»
/guests/android/u-boot.bin  = ../guests/android/u-boot.bin
/guests/linux/Image         = ../guests/linux/Image

libc.so
libm.so
ldqnx-64.so.2
qvm
vdev-virtio-blk.so
vdev-virtio-net.so
vdev-virtio-console.so
vdev-shmem.so
devc-seracmesoc
devb-ufs-acmesoc
smmuman`,
    notes: {
      1: ["Image attributes", "Load address and format of the IFS. The board's bootloader must load it here — the value comes from the BSP sample buildfile."],
      2: ["startup-*", "Board startup from the BSP: minimal hardware init, builds the <em>system page</em> (CPUs, memory, interrupts) and jumps to the kernel."],
      3: ["procnto with the qvm module", "The microkernel. The <code>[module=qvm]</code> attribute links in the virtualization extensions — without it the image is a normal QNX system and qvm cannot start guests."],
      4: ["Startup script", "Runs once at boot, like a minimal <code>init</code>. Keep it short: every millisecond here delays the cluster."],
      5: ["Console", "Serial driver and console redirection. The name of the driver is BSP-specific."],
      6: ["SMMU & storage", "Start the SMMU manager before any pass-through guest, and the storage driver before any guest whose disks live on UFS. <code>waitfor</code> blocks until the device node appears."],
      7: ["Host services", "Your own code: a health monitor that watches guest watchdogs and heartbeats, and the gateway that exchanges vehicle signals with the MCU."],
      8: ["Start the guests", "Order is policy: cluster first (deadline &lt; 2 s), then Linux SE, Android last. Each qvm reads its configuration file."],
      9: ["File list", "<code>target = source</code> places a host file at a path in the image. Bare names are searched in the <code>-r</code> root directories passed to mkifs."],
      10: ["Embedded guests", "Small guests (the cluster IFS, a guest bootloader, the Linux kernel) can be embedded in the host image so they load without the file system. Large ones (Android) come from virtio-blk partitions."],
    },
  });
})();
