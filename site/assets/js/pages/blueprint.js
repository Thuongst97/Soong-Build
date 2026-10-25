/* Module 03 — annotated Android.bp */
(function () {
  const { $, renderCodeExplorer } = window.SBA;
  renderCodeExplorer($("#bp-explorer"), {
    lang: "bp",
    file: "vendor/acme/hals/vehicle/bridge/Android.bp",
    src: `
package {
    default_applicable_licenses: ["vendor_acme_license"],      «1»
}

cc_defaults {
    name: "acme_bridge_defaults",                             «2»
    cflags: ["-Wall", "-Werror", "-Wextra"],
    shared_libs: ["libbase", "liblog", "libutils"],
}

cc_binary {
    name: "acme.vehicle.bridge",                              «3»
    defaults: ["acme_bridge_defaults"],
    vendor: true,                                             «4»
    relative_install_path: "hw",
    srcs: [
        "src/main.cpp",
        "src/VsockChannel.cpp",
        "src/PropertyMapper.cpp",
    ],
    static_libs: ["libacme_vehicle_proto"],                  «5»
    shared_libs: [
        "libbinder_ndk",
        "android.hardware.automotive.vehicle-V3-ndk",
    ],
    cflags: select(soong_config_variable("acme_hu", "vm_transport"), {   «6»
        "shmem": ["-DACME_TRANSPORT_SHMEM"],
        default: ["-DACME_TRANSPORT_VSOCK"],
    }),
    init_rc: ["acme.vehicle.bridge.rc"],                      «7»
    vintf_fragments: ["acme.vehicle.bridge.xml"],
    required: ["acme_bridge.conf"],                           «8»
}

prebuilt_etc {
    name: "acme_bridge.conf",                                 «9»
    src: "config/bridge.conf",
    vendor: true,
    sub_dir: "acme",
}`,
    notes: {
      1: ["package block", "Applies to every module in this file and below: here the default license. Without an applicable license Soong refuses the module."],
      2: ["Defaults", "Shared warnings and common libraries. Every binary in this directory adds <code>defaults: [\"acme_bridge_defaults\"]</code>."],
      3: ["Module name", "Also the installed file name. Dots are allowed and common for HAL services."],
      4: ["Partition", "<code>vendor: true</code> builds the vendor variant and installs to <code>/vendor/bin/hw/</code> (with <code>relative_install_path</code>). It may only link vendor or VNDK/LLNDK libraries."],
      5: ["Dependencies", "<code>static_libs</code> are linked in; <code>shared_libs</code> must exist on the device. The NDK backend of the stable AIDL VHAL interface is versioned (<code>-V3-ndk</code> here) — match the version your Android release freezes."],
      6: ["select()", "Picks compile flags from a Soong config variable set in the product makefile — one source tree, several hypervisor transports."],
      7: ["init & VINTF", "<code>init_rc</code> installs the service's <code>.rc</code> file to <code>/vendor/etc/init/</code>; <code>vintf_fragments</code> declares the HAL it serves in the vendor manifest."],
      8: ["required", "Installing this module also installs <code>acme_bridge.conf</code>. Without it the config file would only be built if listed in <code>PRODUCT_PACKAGES</code>."],
      9: ["prebuilt_etc", "Copies a file to <code>/vendor/etc/acme/bridge.conf</code>. The usual way to ship configuration files."],
    },
  });
})();
