/* =========================================================================
   Soong Build Academy — core runtime
   Shared layout (header, sidebar, pager, footer), global search, scrollspy,
   tabs, syntax highlighter, annotated code viewer, clickable diagrams and
   step-through walkthroughs.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ Site map */
  const SITE = [
    {
      id: "overview", file: "overview.html", num: "01", group: "Foundations",
      title: "The Android Build System at a Glance", short: "Build System Overview", icon: "🧭", accent: "#70cff8",
      desc: "Make → Kati → Soong → Ninja: what each tool does and what happens when you type m.",
      sections: [
        ["history", "From Make to Soong", "history make kati soong bazel roboleaf android.mk"],
        ["toolchain", "The toolchain at a glance", "soong_ui blueprint kati ninja soong_build"],
        ["pipeline", "What happens when you type m", "pipeline soong_ui build.ninja combined ninja"],
        ["graph", "Modules, variants and the build graph", "module variant arch os mutator graph"],
        ["outdir", "Anatomy of out/", "out soong intermediates target product verbose.log"],
        ["takeaways", "Key takeaways", "summary"],
      ],
    },
    {
      id: "setup", file: "setup.html", num: "02", group: "Foundations",
      title: "Host Setup, Source Sync & First Build", short: "Setup & First Build", icon: "🛠️", accent: "#34d399",
      desc: "Workstation sizing, packages, repo, manifests, envsetup.sh, lunch and the m family of commands.",
      sections: [
        ["requirements", "Workstation requirements", "ram disk cpu ubuntu requirements"],
        ["host-packages", "Host packages", "apt packages git python ubuntu"],
        ["repo", "The repo tool & manifests", "repo manifest local_manifests git-repo"],
        ["sync", "Syncing the source", "repo init sync android-latest-release branch partial clone"],
        ["envsetup", "envsetup.sh helpers", "envsetup croot gomod godir mgrep"],
        ["lunch", "Choosing a target with lunch", "lunch product release variant userdebug eng user trunk_staging"],
        ["build-commands", "m, mm, mmm and friends", "m mm mmm installclean nothing dist droid"],
        ["container", "Reproducible builds in a container", "docker container reproducible ccache"],
      ],
    },
    {
      id: "blueprint", file: "blueprint.html", num: "03", group: "Foundations",
      title: "Android.bp & the Blueprint Language", short: "Android.bp Language", icon: "📐", accent: "#a78bfa",
      desc: "Syntax, types, variables, defaults, arch/target variants, select(), visibility and formatting.",
      sections: [
        ["syntax", "Syntax basics", "syntax module property map list comments"],
        ["types", "Types & operators", "bool int string list map concatenation"],
        ["variables", "Variables & defaults", "variables defaults cc_defaults java_defaults"],
        ["variants", "Arch, target & multilib", "arch target multilib lib32 lib64 android host"],
        ["select", "Conditionals with select()", "select soong_config_variable release_flag product_variable"],
        ["visibility", "Visibility, licenses & namespaces", "visibility license package default_visibility"],
        ["explorer", "Annotated Android.bp", "annotated example"],
        ["tooling", "Formatting & conversion tools", "bpfmt androidmk bpmodify"],
      ],
    },
    {
      id: "modules", file: "modules.html", num: "04", group: "Soong in depth",
      title: "Module Types Cookbook", short: "Module Types Cookbook", icon: "🧱", accent: "#fbbf24",
      desc: "cc, java, android_app, prebuilts, genrule, aidl_interface, rust, apex — and where each installs.",
      sections: [
        ["native", "Native C/C++ modules", "cc_binary cc_library cc_library_shared cc_library_static cc_test header_libs"],
        ["java", "Java, Kotlin & apps", "java_library android_app android_library platform_apis certificate privileged"],
        ["prebuilts", "Prebuilts", "prebuilt_etc cc_prebuilt_library_shared android_app_import prebuilt"],
        ["generators", "Generated sources & file groups", "genrule filegroup cmd tools out"],
        ["interfaces", "Interfaces: AIDL, sysprop", "aidl_interface stable versions frozen sysprop_library"],
        ["other-langs", "Rust, Python & shell", "rust_binary rust_library python_binary_host sh_binary"],
        ["apex", "APEX modules", "apex apex_key updatable"],
        ["placement", "Partition placement", "vendor product system_ext odm vendor_available soc_specific"],
        ["install", "Getting a module onto the image", "PRODUCT_PACKAGES required install"],
      ],
    },
    {
      id: "product", file: "product.html", num: "05", group: "Soong in depth",
      title: "Product & Board Configuration", short: "Product & Board Config", icon: "🧬", accent: "#2dd4bf",
      desc: "Device trees, AndroidProducts.mk, product inheritance, BoardConfig.mk, release configs and Soong config variables.",
      sections: [
        ["device-tree", "Device tree layout", "device vendor oem board directory"],
        ["androidproducts", "AndroidProducts.mk & lunch choices", "PRODUCT_MAKEFILES COMMON_LUNCH_CHOICES"],
        ["product-mk", "The product makefile", "PRODUCT_NAME PRODUCT_DEVICE PRODUCT_PACKAGES PRODUCT_COPY_FILES"],
        ["inheritance", "Product inheritance", "inherit-product car.mk generic_system core_64_bit"],
        ["boardconfig", "BoardConfig.mk", "TARGET_ARCH BOARD_ partition size kernel cmdline"],
        ["release", "Release configurations", "release config trunk_staging aconfig flags"],
        ["soong-config", "Passing config to Soong", "soong_config_set SOONG_CONFIG namespace variable"],
        ["automotive", "Automotive product specifics", "car aaos device/generic/car car_product"],
      ],
    },
    {
      id: "extending", file: "extending.html", num: "06", group: "Soong in depth",
      title: "Customizing & Extending Soong", short: "Extending Soong", icon: "🧩", accent: "#a78bfa",
      desc: "soong_namespace, soong_config_module_type, Go plugins and migrating Android.mk to Android.bp.",
      sections: [
        ["when", "Choosing an extension mechanism", "decision extend customize"],
        ["namespaces", "Soong namespaces", "soong_namespace PRODUCT_SOONG_NAMESPACES imports"],
        ["config-module-type", "soong_config_module_type", "soong_config_module_type bool_variables value_variables conditions_default"],
        ["go-plugin", "Writing a Go module type", "bootstrap_go_package go plugin module factory loadhook"],
        ["android-mk", "Migrating Android.mk", "androidmk migration LOCAL_MODULE include BUILD_SHARED_LIBRARY"],
        ["bestpractices", "Best practices", "best practices"],
      ],
    },
    {
      id: "debugging", file: "debugging.html", num: "07", group: "Soong in depth",
      title: "Debugging & Build Performance", short: "Debugging & Performance", icon: "🔎", accent: "#f87171",
      desc: "Logs, ninja queries, module-info, common errors, build traces, ccache and incremental tips.",
      sections: [
        ["logs", "Where the logs are", "error.log verbose.log soong.log build.trace"],
        ["queries", "Querying the graph", "ninja query path commands json-module-graph showcommands"],
        ["module-info", "module-info.json & envsetup lookups", "module-info outmod pathmod allmod refreshmod"],
        ["errors", "Common errors and fixes", "error missing dependency duplicate module neverallow artifact path requirement"],
        ["performance", "Making builds faster", "ccache rbe performance incremental trace"],
        ["clean", "Clean builds without nuking everything", "installclean clobber clean"],
      ],
    },
    {
      id: "images", file: "images.html", num: "08", group: "Images & kernel",
      title: "Partitions & Image Generation", short: "Partitions & Images", icon: "💽", accent: "#70cff8",
      desc: "Partition roles, boot image versions, super/dynamic partitions, AVB, A/B, target-files and signing.",
      sections: [
        ["partitions", "Partition map", "system vendor product system_ext odm vendor_dlkm boot init_boot vendor_boot"],
        ["boot-images", "boot, init_boot & vendor_boot", "boot header version 4 ramdisk gki"],
        ["dynamic", "Dynamic partitions & super", "super lpmake dynamic partitions groups"],
        ["avb", "Android Verified Boot", "avb vbmeta avbtool chained hashtree"],
        ["ab", "A/B (seamless) updates", "a/b slot AB_OTA_UPDATER virtual a/b snapshot"],
        ["targetfiles", "target-files, dist & OTA packages", "target-files dist otapackage ota_from_target_files img_from_target_files"],
        ["signing", "Release signing", "sign_target_files_apks release keys"],
      ],
    },
    {
      id: "kernel", file: "kernel.html", num: "09", group: "Images & kernel",
      title: "Kernel, GKI & Kleaf", short: "Kernel, GKI & Kleaf", icon: "🐧", accent: "#34d399",
      desc: "Generic Kernel Image, kernel manifests, Kleaf (Bazel) builds, vendor modules, DTB/DTBO and guest-kernel config.",
      sections: [
        ["gki", "GKI architecture", "gki generic kernel image kmi vendor modules"],
        ["sync-kernel", "Getting the kernel source", "kernel manifest common-android repo"],
        ["kleaf", "Building with Kleaf", "kleaf bazel kernel_aarch64 dist build.config"],
        ["kernel-modules", "Vendor modules", "ddk kernel_module vendor_dlkm"],
        ["dtb", "Device tree: DTB & DTBO", "dtb dtbo overlay mkdtimg"],
        ["integrate", "Dropping the kernel into the Android build", "TARGET_PREBUILT_KERNEL BOARD_VENDOR_KERNEL_MODULES prebuilt"],
        ["guest-kernel", "Kernel config for a VM guest", "virtio mmio vsock guest config"],
      ],
    },
    {
      id: "headunit", file: "headunit.html", num: "10", group: "Head-unit SoC",
      title: "Head-Unit SoC Architecture", short: "Head-Unit Architecture", icon: "🚗", accent: "#fbbf24",
      desc: "One SoC, four software worlds: QNX Hypervisor host, QNX cluster, Android IVI and Linux SE guests.",
      sections: [
        ["architecture", "The big picture", "soc hypervisor cluster android linux architecture"],
        ["allocation", "Resource partitioning", "cpu ram gpu display passthrough allocation"],
        ["ivc", "Inter-VM communication", "virtio vsock shmem virtio-net ivc"],
        ["boot-timing", "Boot-time budget", "boot time rvc cluster telltale 2s"],
        ["build-matrix", "Four toolchains, one product", "build matrix toolchain soong yocto qnx"],
        ["workspace", "Workspace & super-manifest", "workspace manifest repo layout"],
      ],
    },
    {
      id: "qnx-hypervisor", file: "qnx-hypervisor.html", num: "11", group: "Head-unit SoC",
      title: "QNX Hypervisor Host", short: "QNX Hypervisor Host", icon: "🛡️", accent: "#70cff8",
      desc: "QNX SDP, BSP, mkifs buildfiles, qvm configuration, virtual devices and pass-through.",
      sections: [
        ["concepts", "Hypervisor concepts", "type 1 microkernel qvm vdev host guest"],
        ["sdp", "Installing QNX SDP", "qnx software center sdp qnxsdp-env license"],
        ["bsp", "The board support package", "bsp startup ipl make"],
        ["buildfile", "Host buildfile & mkifs", "mkifs buildfile ifs procnto script"],
        ["qvm", "qvm guest configuration", "qvm config ram cpu load vdev pass"],
        ["vdevs", "Virtual devices", "virtio-blk virtio-net virtio-console shmem vdev-gic timer"],
        ["passthrough", "Pass-through devices", "pass interrupt mmio smmu"],
        ["build-host", "Building the host image", "make mkifs host ifs"],
      ],
    },
    {
      id: "qnx-cluster", file: "qnx-cluster.html", num: "12", group: "Head-unit SoC",
      title: "QNX Instrument Cluster Guest", short: "QNX Cluster Guest", icon: "⏱️", accent: "#f59e0b",
      desc: "Guest IFS, Screen graphics, early telltales and RVC, safety partitioning and the cluster build.",
      sections: [
        ["role", "What the cluster VM owns", "cluster telltale speed safety asil"],
        ["guest-image", "Cluster guest image", "guest buildfile ifs virtio"],
        ["graphics", "Screen & display ownership", "screen graphics display gpu kanzi"],
        ["early", "Early features: telltales & RVC", "rvc rear view camera early boot telltale"],
        ["safety", "Freedom from interference", "safety iso 26262 ffi watchdog"],
        ["build-cluster", "Building the cluster image", "build cluster mkifs"],
      ],
    },
    {
      id: "android-guest", file: "android-guest.html", num: "13", group: "Head-unit SoC",
      title: "Android Automotive Guest", short: "Android (AAOS) Guest", icon: "🤖", accent: "#34d399",
      desc: "A device tree for an AAOS VM: product, board, virtio HALs, VHAL bridge, display/audio, SELinux and images.",
      sections: [
        ["approach", "Android as a VM guest", "trout cuttlefish guest virtual"],
        ["device-tree", "Device tree for the guest", "device acme hu android guest"],
        ["product", "Product makefile", "car product inherit packages"],
        ["board", "BoardConfig for a guest", "boardconfig super virtio kernel"],
        ["hals", "HALs over virtio", "hal virtio gralloc graphics audio"],
        ["vhal", "VHAL bridge to the vehicle", "vhal vsock grpc mcu can"],
        ["display-audio", "Displays & audio routing", "display cluster audio zones"],
        ["sepolicy", "SELinux for guest services", "sepolicy vsock file_contexts"],
        ["build-android", "Building the Android images", "build m dist images"],
      ],
    },
    {
      id: "linux-se", file: "linux-se.html", num: "14", group: "Head-unit SoC",
      title: "Linux SE Guest with Yocto", short: "Linux SE Guest (Yocto)", icon: "🔐", accent: "#a78bfa",
      desc: "A security-enhanced Linux service VM: Yocto layers, machine config, SELinux, image recipe and build.",
      sections: [
        ["role", "What the Linux SE VM does", "linux se telematics gateway ota security"],
        ["yocto-setup", "Setting up Yocto", "poky bitbake oe-init-build-env scarthgap"],
        ["layers", "Layers", "meta layer bblayers meta-selinux meta-virtualization"],
        ["machine", "A machine for the VM", "machine conf virtio kernel"],
        ["selinux", "Enabling SELinux", "selinux refpolicy enforcing"],
        ["image", "Image recipe", "image recipe IMAGE_INSTALL wic"],
        ["build-linux", "Building & outputs", "bitbake deploy images"],
      ],
    },
    {
      id: "integration", file: "integration.html", num: "15", group: "Head-unit SoC",
      title: "Full Image Integration, Boot & Flashing", short: "Integration & Flashing", icon: "📦", accent: "#f87171",
      desc: "Storage layout, firmware chain, end-to-end boot, one build script, flashing, OTA across VMs and CI.",
      sections: [
        ["storage", "Storage layout", "gpt ufs emmc partition layout lun"],
        ["firmware", "Firmware & secure boot chain", "rom bootloader tf-a trustzone secure boot"],
        ["boot-flow", "End-to-end boot", "boot sequence power on cluster android"],
        ["build-all", "One script to build everything", "build all orchestration script"],
        ["packaging", "Packaging the flashable bundle", "package bundle sparse manifest"],
        ["flashing", "Flashing the board", "fastboot flash download mode"],
        ["ota", "Updating four OSes", "ota update a/b orchestrator"],
        ["ci", "CI pipeline", "ci pipeline cache artifacts"],
        ["checklist", "Bring-up checklist", "checklist bring-up"],
      ],
    },
    {
      id: "cheatsheet", file: "cheatsheet.html", num: "A", group: "Reference",
      title: "Command Cheat Sheet", short: "Cheat Sheet", icon: "📋", accent: "#94a3b8",
      desc: "Every command from the handbook on one page.",
      sections: [
        ["cs-android", "Android / Soong", "m lunch repo"],
        ["cs-query", "Inspect & debug", "ninja query module-info"],
        ["cs-images", "Images & signing", "lpmake avbtool dist"],
        ["cs-kernel", "Kernel", "kleaf bazel"],
        ["cs-qnx", "QNX", "mkifs qvm"],
        ["cs-yocto", "Yocto", "bitbake"],
      ],
    },
    {
      id: "glossary", file: "glossary.html", num: "B", group: "Reference",
      title: "Glossary", short: "Glossary", icon: "📖", accent: "#94a3b8",
      desc: "Build, image, hypervisor and automotive terms.",
      sections: [["glossary", "Glossary of terms", "glossary terms"]],
    },
  ];

  /* --------------------------------------------- Official references */
  const SA = "https://source.android.com/docs/";
  const GS = "https://android.googlesource.com/";
  const R = {
    buildOverview: ["Soong build system", SA + "setup/build"],
    building: ["Build Android", SA + "setup/build/building"],
    requirements: ["Hardware and software requirements", SA + "setup/start/requirements"],
    download: ["Download the Android source", SA + "setup/download"],
    repoRef: ["Repo command reference", SA + "setup/reference/repo"],
    repoSrc: ["git-repo source", "https://gerrit.googlesource.com/git-repo"],
    bpRef: ["Android.bp file format", SA + "setup/reference/androidbp"],
    soongReadme: ["Soong README", GS + "platform/build/soong/+/refs/heads/main/README.md"],
    soongBest: ["Soong best practices", GS + "platform/build/soong/+/refs/heads/main/docs/best_practices.md"],
    soongPerf: ["Build performance", GS + "platform/build/soong/+/refs/heads/main/docs/perf.md"],
    soongSelects: ["select statements", GS + "platform/build/soong/+/refs/heads/main/docs/selects.md"],
    soongModules: ["Soong module reference (generated)", "https://ci.android.com/builds/latest/branches/aosp-build-tools/targets/linux/view/soong_build.html"],
    blueprint: ["Blueprint", GS + "platform/build/blueprint/+/refs/heads/main/"],
    makeChanges: ["build/make Changes.md", GS + "platform/build/+/refs/heads/main/Changes.md"],
    usage: ["build/make Usage.txt", GS + "platform/build/+/refs/heads/main/Usage.txt"],
    kati: ["Kati", "https://github.com/google/kati"],
    ninja: ["Ninja manual", "https://ninja-build.org/manual.html"],
    partitions: ["Partitions overview", SA + "core/architecture/partitions"],
    dynamic: ["Dynamic partitions", SA + "core/ota/dynamic_partitions"],
    bootHeader: ["Boot image header", SA + "core/architecture/bootloader/boot-image-header"],
    genericBoot: ["Generic boot partition (init_boot)", SA + "core/architecture/partitions/generic-boot"],
    vendorBoot: ["Vendor boot partitions", SA + "core/architecture/partitions/vendor-boot-partitions"],
    avb: ["Android Verified Boot (AVB) README", GS + "platform/external/avb/+/refs/heads/main/README.md"],
    ab: ["A/B (seamless) system updates", SA + "core/ota/ab"],
    vab: ["Virtual A/B overview", SA + "core/ota/virtual_ab"],
    signing: ["Sign builds for release", SA + "core/ota/sign_builds"],
    gki: ["Generic Kernel Image (GKI) project", SA + "core/architecture/kernel/generic-kernel-image"],
    buildKernels: ["Build kernels", SA + "setup/build/building-kernels"],
    kleaf: ["Kleaf README", GS + "kernel/build/+/refs/heads/main/kleaf/README.md"],
    dt: ["Device tree overlays", SA + "core/architecture/dto"],
    virt: ["Automotive virtualization", SA + "automotive/virtualization"],
    virtArch: ["Virtualization architecture", SA + "automotive/virtualization/architecture"],
    trout: ["device/google/trout (AAOS on a hypervisor)", GS + "device/google/trout/"],
    cuttlefish: ["Cuttlefish virtual device", SA + "devices/cuttlefish"],
    carProduct: ["device/generic/car", GS + "device/generic/car/"],
    vhal: ["Vehicle HAL", SA + "automotive/vhal"],
    aaos: ["Android Automotive overview", SA + "automotive"],
    selinux: ["SELinux in Android", SA + "security/features/selinux"],
    virtio: ["VIRTIO 1.2 specification", "https://docs.oasis-open.org/virtio/virtio/v1.2/virtio-v1.2.html"],
    qnxDocs: ["QNX documentation", "https://www.qnx.com/developers/docs/"],
    yocto: ["Yocto Project documentation", "https://docs.yoctoproject.org/"],
    yoctoQs: ["Yocto Project quick build", "https://docs.yoctoproject.org/brief-yoctoprojectqs/index.html"],
    yoctoRef: ["Yocto reference manual — variables", "https://docs.yoctoproject.org/ref-manual/variables.html"],
    metaSelinux: ["meta-selinux layer", "https://git.yoctoproject.org/meta-selinux"],
    layerIndex: ["OpenEmbedded layer index", "https://layers.openembedded.org/"],
  };
  const REFS = {
    overview: ["buildOverview", "soongReadme", "blueprint", "kati", "ninja", "makeChanges"],
    setup: ["requirements", "download", "repoRef", "repoSrc", "building", "usage"],
    blueprint: ["bpRef", "soongReadme", "soongSelects", "soongModules", "blueprint"],
    modules: ["soongModules", "soongReadme", "bpRef", "partitions"],
    product: ["building", "makeChanges", "soongReadme", "carProduct", "aaos"],
    extending: ["soongReadme", "soongBest", "blueprint", "soongSelects"],
    debugging: ["soongPerf", "usage", "ninja", "soongBest"],
    images: ["partitions", "bootHeader", "genericBoot", "vendorBoot", "dynamic", "avb", "ab", "vab", "signing"],
    kernel: ["gki", "buildKernels", "kleaf", "dt"],
    headunit: ["virt", "virtArch", "trout", "virtio", "qnxDocs", "yocto"],
    "qnx-hypervisor": ["qnxDocs", "virtio", "virtArch"],
    "qnx-cluster": ["qnxDocs", "virtArch"],
    "android-guest": ["trout", "cuttlefish", "virtArch", "carProduct", "vhal", "selinux"],
    "linux-se": ["yocto", "yoctoQs", "yoctoRef", "metaSelinux", "layerIndex"],
    integration: ["avb", "ab", "signing", "virtArch", "qnxDocs", "yocto"],
    cheatsheet: ["usage", "repoRef", "kleaf", "qnxDocs", "yoctoQs"],
    glossary: ["buildOverview", "partitions", "virt"],
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };

  const pageId = document.body.dataset.page || "home";
  const currentPage = SITE.find((p) => p.id === pageId);

  const ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  /* --------------------------------------------------------------- Header */
  function renderHeader() {
    const host = $("#site-header");
    if (!host) return;
    const modLinks = SITE.filter((p) => p.group !== "Reference")
      .map((p) => `<a href="${p.file}"><span class="dm-num">${p.num}</span><span><b>${esc(p.short)}</b><i>${esc(p.desc)}</i></span></a>`)
      .join("");
    const nav = [["blueprint", "Android.bp"], ["images", "Images"], ["headunit", "Head Unit"], ["integration", "Integration"], ["cheatsheet", "Cheat Sheet"], ["glossary", "Glossary"]];
    host.outerHTML = `
      <header class="site-header">
        <button class="menu-btn" id="menu-btn" aria-label="Open table of contents">☰</button>
        <a class="brand" href="index.html" aria-label="Soong Build Academy home">
          <div class="brand-mark">SB</div>
          <span>Soong Build Academy<small>From Android.bp to a head-unit image</small></span>
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <a href="index.html" class="${pageId === "home" ? "active" : ""}">Home</a>
          <div class="nav-drop ${currentPage && currentPage.group !== "Reference" ? "active" : ""}">
            <button aria-haspopup="true">Modules ▾</button>
            <div class="nav-drop-menu">${modLinks}</div>
          </div>
          ${nav.map(([id, label]) => `<a href="${id}.html" class="${pageId === id ? "active" : ""}">${label}</a>`).join("")}
        </nav>
        <div class="header-spacer"></div>
        <div class="global-search" role="search">
          <span class="s-icon">${ICON_SEARCH}</span>
          <input id="gs-input" type="search" placeholder="Search: lunch, qvm, super…" autocomplete="off" aria-label="Search the site">
          <kbd>Ctrl K</kbd>
          <div class="search-results" id="gs-results" role="listbox"></div>
        </div>
        <button class="theme-btn" id="theme-btn" type="button"></button>
      </header>`;
  }

  /* ---------------------------------------------------------- Theme */
  function initTheme() {
    const btn = $("#theme-btn");
    if (!btn) return;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const effective = () => root.getAttribute("data-theme") || (media.matches ? "light" : "dark");
    const paint = () => {
      const light = effective() === "light";
      btn.textContent = light ? "🌙" : "☀️";
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      btn.title = btn.getAttribute("aria-label");
    };
    btn.addEventListener("click", () => {
      const next = effective() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      store.set("sba-theme", next);
      paint();
    });
    media.addEventListener("change", paint);
    paint();
  }

  /* ------------------------------------------------------- Global search */
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function buildIndex() {
    const idx = [];
    SITE.forEach((p) => {
      idx.push({ title: p.title, sub: p.desc, page: p.short, href: p.file, hay: norm(p.title + " " + p.desc + " " + p.short) });
      p.sections.forEach(([id, t, kw]) => idx.push({ title: t, sub: p.short, page: p.num, href: `${p.file}#${id}`, hay: norm(t + " " + kw + " " + p.short) }));
    });
    (window.GLOSSARY || []).forEach((g) => idx.push({ title: g.term, sub: g.full, page: "Glossary", href: `glossary.html#g-${slug(g.term)}`, hay: norm(g.term + " " + g.full + " " + g.desc) }));
    return idx;
  }
  function hilite(text, q) {
    if (!q) return esc(text);
    const n = norm(text), i = n.indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  function initGlobalSearch() {
    const input = $("#gs-input"), box = $("#gs-results");
    if (!input) return;
    let index = null, sel = -1;
    const run = () => {
      index = index || buildIndex();
      const q = norm(input.value.trim());
      if (!q) { box.classList.remove("open"); return; }
      const terms = q.split(/\s+/);
      const hits = index.filter((e) => terms.every((t) => e.hay.includes(t))).slice(0, 12);
      sel = -1;
      box.innerHTML = hits.length
        ? hits.map((h) => `<a href="${h.href}" role="option"><span class="sr-page">${esc(h.page)}</span><br><b>${hilite(h.title, q)}</b><small>${esc(h.sub)}</small></a>`).join("")
        : `<div class="sr-empty">No results for “${esc(input.value)}”.</div>`;
      box.classList.add("open");
    };
    input.addEventListener("input", run);
    input.addEventListener("focus", () => input.value && run());
    input.addEventListener("keydown", (e) => {
      const items = $$("a", box);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((a, i) => a.classList.toggle("sel", i === sel));
        items[sel].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        const t = items[sel >= 0 ? sel : 0];
        if (t) location.href = t.getAttribute("href");
      } else if (e.key === "Escape") {
        box.classList.remove("open"); input.blur();
      }
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".global-search")) box.classList.remove("open"); });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); input.focus(); input.select(); }
      else if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    });
  }

  /* --------------------------------------------------------------- Sidebar */
  function renderSidebar() {
    const host = $("#sidebar");
    if (!host) return;
    const domSections = $$("section.doc-section[id]");
    const groups = {};
    SITE.forEach((p) => (groups[p.group] = groups[p.group] || []).push(p));
    let html = `
      <div class="sb-progress">
        <div class="sb-progress-label"><span>Reading progress</span><span id="sb-pct">0%</span></div>
        <div class="sb-progress-bar"><div id="sb-bar"></div></div>
      </div>
      <div class="sb-filter">${ICON_SEARCH}
        <input id="sb-filter" type="search" placeholder="Filter contents…" aria-label="Filter table of contents">
        <div class="sb-filter-info" id="sb-filter-info"></div>
      </div>
      <nav aria-label="Table of contents">`;
    Object.entries(groups).forEach(([g, pages]) => {
      html += `<div class="sb-group"><div class="sb-group-title">${esc(g)}</div>`;
      pages.forEach((p) => {
        const cur = p.id === pageId;
        html += `<a class="sb-page ${cur ? "current" : ""}" href="${p.file}" data-hay="${esc(norm(p.title + " " + p.desc + " " + p.sections.map((s) => s[1] + " " + s[2]).join(" ")))}"><span class="sb-num">${p.num}</span>${esc(p.short)}</a>`;
        if (cur && domSections.length) {
          html += `<ul class="sb-sections">` + domSections.map((s) => {
            const title = s.dataset.title || ($("h2", s) || {}).textContent || s.id;
            const num = (($(".sec-num", s) || {}).textContent || "").trim();
            return `<li><a href="#${s.id}" data-target="${s.id}">${/^\d/.test(num) ? `<span class="sb-snum">${esc(num)}</span>` : ""}<span>${esc(title)}</span></a></li>`;
          }).join("") + `</ul>`;
        }
      });
      html += `</div>`;
    });
    html += `</nav>`;
    host.innerHTML = html;

    const sectionText = new Map(domSections.map((s) => [s.id, norm(s.textContent)]));
    const input = $("#sb-filter"), info = $("#sb-filter-info");
    input.addEventListener("input", () => {
      const q = norm(input.value.trim());
      let hitsSec = 0, hitsPage = 0;
      $$(".sb-sections a", host).forEach((a) => {
        const ok = !q || sectionText.get(a.dataset.target).includes(q) || norm(a.textContent).includes(q);
        a.parentElement.classList.toggle("sb-hidden", !ok);
        if (ok && q) hitsSec++;
      });
      $$(".sb-page", host).forEach((a) => {
        const ok = !q || a.dataset.hay.includes(q) || a.classList.contains("current");
        a.classList.toggle("sb-hidden", !ok);
        if (ok && q && !a.classList.contains("current")) hitsPage++;
      });
      $$(".sb-group", host).forEach((g) => g.classList.toggle("sb-hidden", !$$(".sb-page:not(.sb-hidden)", g).length));
      info.textContent = q ? `${hitsSec} section(s) on this page · ${hitsPage} other page(s)` : "";
    });

    const btn = $("#menu-btn");
    if (btn) {
      btn.addEventListener("click", () => host.classList.toggle("open"));
      host.addEventListener("click", (e) => { if (e.target.closest("a")) host.classList.remove("open"); });
    }
  }

  /* --------------------------------------------- Scrollspy & progress */
  function initScrollspy() {
    const links = $$(".sb-sections a");
    const bar = $("#sb-bar"), pct = $("#sb-pct");
    const sections = $$("section.doc-section[id]");
    const onScroll = () => {
      const h = document.documentElement;
      const p = Math.min(100, Math.max(0, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100));
      if (bar) bar.style.width = p + "%";
      if (pct) pct.textContent = Math.round(p) + "%";
      let active = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top - 140 <= 0) active = s; });
      links.forEach((a) => a.classList.toggle("active", active && a.dataset.target === active.id));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function decorateSections() {
    $$("section.doc-section[id]").forEach((s) => {
      const head = $(".sec-head h2", s);
      if (head && !$(".anchor", head)) head.insertAdjacentHTML("beforeend", `<a class="anchor" href="#${s.id}" aria-label="Link to section">#</a>`);
    });
  }

  /* ------------------------------------------------- References */
  function renderReferences() {
    const keys = REFS[pageId];
    const pager = $("#pager");
    if (!keys || !pager) return;
    const sec = document.createElement("section");
    sec.className = "doc-section";
    sec.id = "references";
    sec.dataset.title = "Official references";
    const count = $$("section.doc-section .sec-num").filter((e) => /^\d/.test(e.textContent)).length;
    const num = currentPage && /^\d+$/.test(currentPage.num) ? `${+currentPage.num}.${count + 1}` : "📚";
    sec.innerHTML = `<div class="sec-head"><h2><span class="sec-num">${num}</span>Official references</h2></div>
      <p class="small muted">Primary sources for this page. Build-system details move with every Android, QNX and Yocto release — for your branch, the source tree and your vendor's BSP documentation are the final authority.</p>
      <div class="ref-list">${keys.map((k) => {
        const [title, url] = R[k];
        return `<a class="ref-item glass" href="${url}" target="_blank" rel="noopener"><b>${esc(title)}</b><small>${esc(url.replace(/^https:\/\//, "")).replace(/([/_.+-])(?=[^/_.+-])/g, "$1<wbr>")}</small></a>`;
      }).join("")}</div>`;
    pager.parentNode.insertBefore(sec, pager);
  }

  /* ----------------------------------------------------------- Pager */
  function renderPager() {
    const host = $("#pager");
    if (!host || !currentPage) return;
    const i = SITE.indexOf(currentPage);
    const prev = SITE[i - 1], next = SITE[i + 1];
    host.className = "pager";
    host.innerHTML =
      (prev ? `<a href="${prev.file}"><small>← Previous</small><b>${esc(prev.short)}</b></a>` : `<a href="index.html"><small>← Back</small><b>Home</b></a>`) +
      (next ? `<a class="next" href="${next.file}"><small>Next →</small><b>${esc(next.short)}</b></a>` : "");
  }

  /* ----------------------------------------------------------- Footer */
  function renderFooter() {
    const host = $("#site-footer");
    if (!host) return;
    host.outerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div><b style="color:var(--text)">Soong Build Academy</b> — from your first <code>Android.bp</code> to a flashable head-unit image.<br>
          Educational content. Android paths follow AOSP <code>main</code> / Android 15–16; QNX and SoC details are generic and illustrative — always follow your SoC vendor's BSP.</div>
          <div class="footer-links">
            <a href="overview.html">Overview</a><a href="blueprint.html">Android.bp</a><a href="images.html">Images</a>
            <a href="headunit.html">Head Unit</a><a href="integration.html">Integration</a><a href="cheatsheet.html">Cheat Sheet</a><a href="glossary.html">Glossary</a>
          </div>
        </div>
      </footer>`;
  }

  /* ------------------------------------------------------------- Tabs */
  function initTabs(root = document) {
    $$("[data-tabs]", root).forEach((tabs) => {
      if (tabs.dataset.ready) return;
      tabs.dataset.ready = "1";
      const btns = $$(":scope > .tab-list > button", tabs);
      const panels = $$(":scope > .tab-panel", tabs);
      const select = (key, focus) => {
        btns.forEach((b) => {
          const on = b.dataset.tab === key;
          b.setAttribute("aria-selected", on);
          b.tabIndex = on ? 0 : -1;
          if (on && focus) b.focus();
        });
        panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === key));
      };
      btns.forEach((b, i) => {
        b.setAttribute("role", "tab");
        b.type = "button";
        b.addEventListener("click", () => select(b.dataset.tab));
        b.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const n = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
            select(n.dataset.tab, true);
          }
        });
      });
      const initial = btns.find((b) => b.getAttribute("aria-selected") === "true") || btns[0];
      if (initial) select(initial.dataset.tab);
    });
  }

  /* ---------------------------------------------------- Highlighter */
  const C_COM = String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`;
  const H_COM = String.raw`(?:^|(?<=[\s;]))#[^\n]*`;
  const LANGS = {
    bp: { com: C_COM, kw: "true false", props: true },
    go: { com: C_COM, kw: "package import func return if else for range var const type struct interface map chan go defer switch case default break continue nil true false" },
    cpp: { com: C_COM, pp: true, kw: "namespace class struct public private protected override final const constexpr static auto return if else switch case default break continue for while do void int float double bool true false nullptr using template typename virtual explicit new delete inline char unsigned long enum sizeof this" },
    java: { com: C_COM, kw: "package import class interface public private protected static final void return if else for while new null true false this super throws throw try catch finally extends implements int long float double boolean" },
    aidl: { com: C_COM, kw: "package import interface parcelable oneway in out inout void int long float double byte boolean String const enum union" },
    bash: { com: H_COM, kw: "if then else elif fi for in do done case esac while until function export source return local set unset sudo", vars: true, cmd: true, words: true },
    make: { com: H_COM, kw: "include ifeq ifneq ifdef ifndef else endif define endef export override", vars: true, words: true },
    bitbake: { com: H_COM, kw: "inherit require include export", vars: true, words: true },
    conf: { com: H_COM, kw: "", words: true },
    json: { com: "(?!)", kw: "true false null", props: true },
    python: { com: H_COM, kw: "def return if elif else for in import from as class None True False with while try except raise pass and or not lambda" },
  };
  const TYPES = new Set("uint8_t uint16_t uint32_t int32_t int64_t size_t std string vector".split(" "));
  function tokenize(code, lang) {
    if (lang === "xml") return tokXml(code);
    const L = LANGS[lang] || LANGS.conf;
    const kw = new Set(L.kw.split(" "));
    const pp = L.pp ? String.raw`^[ \t]*#[a-z]+[^\n]*` : "(?!)";
    const vars = L.vars ? String.raw`\$\{[^}\n]*\}|\$\([A-Za-z_][\w-]*|\$[A-Za-z_]\w*|\$[@#?*0-9]` : "(?!)";
    const re = new RegExp(`(${L.com})|("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|(${pp})|(${vars})|(@[A-Za-z_]\\w*)|(\\b0x[0-9A-Fa-f]+\\b|\\b\\d+(?:\\.\\d+)?[fFLuKMG]?\\b)|([A-Za-z_][\\w.-]*[\\w]|[A-Za-z_])|([\\s\\S])`, "gm");
    const out = [];
    let m;
    while ((m = re.exec(code))) {
      let cls = "";
      let t = m[0];
      if (m[1]) cls = "com";
      else if (m[2]) cls = "str";
      else if (m[3]) cls = "pp";
      else if (m[4]) cls = "cst";
      else if (m[5]) cls = "ann";
      else if (m[6]) cls = "num";
      else if (m[7]) {
        // "." and "-" belong to words only in shell/make/config languages; split them elsewhere
        if (!L.words && /[.-]/.test(t)) {
          t = t.match(/^[A-Za-z_]\w*/)[0];
          re.lastIndex = m.index + t.length;
        }
        const rest = code.slice(re.lastIndex, re.lastIndex + 3);
        const lineStart = code.lastIndexOf("\n", m.index - 1) + 1;
        const before = code.slice(lineStart, m.index);
        if (kw.has(t)) cls = "kw";
        else if (L.props && /^\s*:(?!:)/.test(rest)) cls = "attr";
        else if (L.props && /^\s*\{/.test(rest)) cls = "fn";
        else if (L.cmd && /^\s*(?:sudo\s+)?$/.test(before)) cls = "fn";
        else if (/^[A-Z][A-Z0-9_]{2,}$/.test(t)) cls = "cst";
        else if (rest[0] === "(" && !L.vars) cls = "fn";
        else if (!L.cmd && (/^[A-Z][a-z]/.test(t) || TYPES.has(t))) cls = "ty";
      }
      push(out, cls, t);
    }
    return out;
  }
  function tokXml(code) {
    const re = /(<!--[\s\S]*?-->)|(<\/?[\w:.-]+)|([\w:.-]+)(?==)|("[^"]*")|(\/?>|\?>)|([\s\S])/g;
    const out = [];
    let m;
    while ((m = re.exec(code))) {
      const cls = m[1] ? "com" : m[2] ? "tag" : m[3] ? "attr" : m[4] ? "str" : m[5] ? "tag" : "";
      push(out, cls, m[0]);
    }
    return out;
  }
  function push(out, cls, t) {
    const last = out[out.length - 1];
    if (last && last.cls === cls && !cls) last.text += t;
    else out.push({ cls, text: t });
  }
  function toLines(tokens) {
    const lines = [[]];
    tokens.forEach((tok) => {
      tok.text.split("\n").forEach((part, i) => {
        if (i > 0) lines.push([]);
        if (part) lines[lines.length - 1].push(tok.cls ? `<span class="t-${tok.cls}">${esc(part)}</span>` : esc(part));
      });
    });
    return lines.map((l) => l.join(""));
  }

  /** Strip «n» markers from code, return {code, marks: {lineIndex: n}} */
  function parseMarks(src) {
    const marks = {};
    const raw = src.replace(/^\n+|\s+$/g, "").split("\n");
    const indent = Math.min(...raw.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const lines = raw.map((line, i) => {
      line = line.slice(indent);
      const m = line.match(/\s*«(\d+)»\s*$/);
      if (m) { marks[i] = +m[1]; return line.slice(0, m.index); }
      return line;
    });
    return { code: lines.join("\n"), marks };
  }

  const LANG_LABEL = { bp: "Android.bp", bash: "Shell", make: "Make", go: "Go", cpp: "C++", java: "Java", aidl: "AIDL", xml: "XML", conf: "Config", json: "JSON", bitbake: "BitBake", python: "Python" };
  function codeBlockHTML({ code, lang, file, marks = {}, label }) {
    const lines = toLines(tokenize(code, lang));
    const body = lines.map((l, i) => {
      const n = marks[i];
      return `<div class="cl${n ? " ann" : ""}" ${n ? `data-ann="${n}"` : ""}><span class="lno">${i + 1}</span><span class="lc">${l || " "}</span>${n ? `<span class="abadge">${n}</span>` : ""}</div>`;
    }).join("");
    return `<div class="code-block">
      <div class="code-head"><div class="dots"><i></i><i></i><i></i></div><span class="fname">${esc(file || "")}</span>
      <span class="lang badge gray">${esc(label || LANG_LABEL[lang] || lang)}</span><button class="copy-btn" type="button">Copy</button></div>
      <pre class="code" tabindex="0">${body}</pre></div>`;
  }
  function wireCopy(root) {
    $$(".copy-btn", root).forEach((b) => {
      if (b.dataset.wired) return;
      b.dataset.wired = "1";
      b.addEventListener("click", () => {
        const pre = b.closest(".code-block").querySelector("pre");
        const text = $$(".lc", pre).map((x) => x.textContent).join("\n");
        const done = () => { b.textContent = "Copied ✓"; setTimeout(() => (b.textContent = "Copy"), 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
        else fallbackCopy(text, done);
      });
    });
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
    ta.remove();
  }
  /** Highlighted block from <script type="text/plain" data-code data-lang data-file> */
  function renderStaticCode(root = document) {
    $$("script[type='text/plain'][data-code]", root).forEach((s) => {
      const { code } = parseMarks(s.textContent);
      const wrap = document.createElement("div");
      wrap.innerHTML = codeBlockHTML({ code, lang: s.dataset.lang, file: s.dataset.file, label: s.dataset.label });
      s.replaceWith(wrap.firstElementChild);
    });
    wireCopy(root);
  }

  /** Annotated explorer: code on the left, explanations on the right */
  function renderCodeExplorer(host, spec) {
    const { code, marks } = parseMarks(spec.src);
    const notes = spec.notes;
    host.innerHTML = `<div class="code-explorer">
      ${codeBlockHTML({ code, lang: spec.lang, file: spec.file, marks, label: spec.label })}
      <div class="ann-list glass">${Object.keys(notes).map((n) => `<div class="ann-item" data-ann="${n}" tabindex="0"><span class="an">${n}</span><div><b>${esc(notes[n][0])}</b><p>${notes[n][1]}</p></div></div>`).join("")}</div>
    </div>`;
    const pre = $("pre", host), list = $(".ann-list", host);
    const select = (n, from) => {
      $$(".cl.hl", pre).forEach((x) => x.classList.remove("hl"));
      $$(".ann-item", list).forEach((x) => x.classList.toggle("sel", x.dataset.ann === String(n)));
      const line = $(`.cl[data-ann="${n}"]`, pre);
      if (line) {
        line.classList.add("hl");
        if (from === "list") pre.scrollTo({ top: line.offsetTop - pre.clientHeight / 3, behavior: "smooth" });
      }
      const item = $(`.ann-item[data-ann="${n}"]`, list);
      if (item && from === "code") list.scrollTo({ top: item.offsetTop - 10, behavior: "smooth" });
    };
    $$(".cl.ann", pre).forEach((l) => l.addEventListener("click", () => select(l.dataset.ann, "code")));
    $$(".ann-item", list).forEach((it) => {
      it.addEventListener("click", () => select(it.dataset.ann, "list"));
      it.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(it.dataset.ann, "list"); } });
    });
    wireCopy(host);
  }

  /* --------------------------------------------- Detail rendering helper */
  /** item: {title, tags:[[text, cls]], html, code, lang, file} */
  function detailHTML(item) {
    return (item.tags && item.tags.length ? `<div class="ip-tags">${item.tags.map((t) => `<span class="badge ${t[1] || ""}">${esc(t[0])}</span>`).join("")}</div>` : "") +
      `<h4>${esc(item.title)}</h4>${item.html || ""}` +
      (item.code ? codeBlockHTML({ code: parseMarks(item.code).code, lang: item.lang || "bash", file: item.file || "" }) : "");
  }

  /* ------------------------------------------------ Clickable diagrams */
  /**
   * picker(host, data, first): every [data-k] inside host shows data[k] in host's .info-panel.
   */
  function picker(host, data, first) {
    if (!host) return;
    const panel = $(".info-panel", host);
    const items = $$("[data-k]", host);
    const show = (k) => {
      const d = data[k];
      if (!d) return;
      items.forEach((el) => el.classList.toggle("on", el.dataset.k === k));
      panel.innerHTML = detailHTML(d);
      wireCopy(panel);
    };
    items.forEach((el) => {
      if (el.tagName !== "BUTTON") { el.tabIndex = 0; el.setAttribute("role", "button"); }
      el.addEventListener("click", () => show(el.dataset.k));
      el.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && el.tagName !== "BUTTON") { e.preventDefault(); show(el.dataset.k); } });
    });
    show(first || items[0].dataset.k);
    return { show };
  }

  /* ------------------------------------------------------ Step-through */
  /**
   * stepper(host, {steps:[{title, who, tags, html, code, lang, file, hl:[keys]}], target, intro})
   * target: element whose [data-k] children get .on for the current step's hl keys.
   */
  function stepper(host, opts) {
    if (!host) return;
    const { steps } = opts;
    let cur = -1, timer = null;
    host.classList.add("stepper", "glass");
    host.innerHTML = `
      <div class="st-toolbar">
        <button class="btn sm" data-act="reset" type="button">⟲ Reset</button>
        <button class="btn sm" data-act="prev" type="button">◀ Prev</button>
        <button class="btn sm primary" data-act="next" type="button">Next ▶</button>
        <button class="btn sm" data-act="play" type="button">▶ Auto</button>
        <span class="st-count">0 / ${steps.length}</span>
      </div>
      <div class="st-progress"><div></div></div>
      <div class="st-body">
        <ol class="st-list">${steps.map((s, i) => `<li><button type="button" data-i="${i}"><span class="sn">${i + 1}</span><span>${esc(s.title)}${s.who ? `<span class="sw">${esc(s.who)}</span>` : ""}</span></button></li>`).join("")}</ol>
        <div class="st-detail" aria-live="polite"></div>
      </div>`;
    const detail = $(".st-detail", host), count = $(".st-count", host), prog = $(".st-progress > div", host);
    const playBtn = $('[data-act="play"]', host);
    const render = () => {
      $$(".st-list button", host).forEach((b) => {
        const i = +b.dataset.i;
        b.classList.toggle("cur", i === cur);
        b.classList.toggle("done", i < cur);
      });
      const s = steps[cur];
      if (opts.target) $$("[data-k]", opts.target).forEach((el) => el.classList.toggle("on", !!s && (s.hl || []).includes(el.dataset.k)));
      count.textContent = `${cur + 1} / ${steps.length}`;
      prog.style.width = ((cur + 1) / steps.length) * 100 + "%";
      if (!s) detail.innerHTML = `<h4>Ready</h4><p class="muted">${opts.intro || "Press <b>Next ▶</b> to walk through each step."}</p>`;
      else {
        detail.innerHTML = `<div class="st-tags"><span class="badge gray">Step ${cur + 1}</span>${(s.tags || []).map((t) => `<span class="badge ${t[1] || ""}">${esc(t[0])}</span>`).join("")}</div>
          <h4>${esc(s.title)}</h4>${s.html || ""}` + (s.code ? codeBlockHTML({ code: parseMarks(s.code).code, lang: s.lang || "bash", file: s.file || "" }) : "");
        wireCopy(detail);
      }
    };
    const go = (i) => { cur = Math.max(-1, Math.min(steps.length - 1, i)); render(); };
    const stop = () => { clearInterval(timer); timer = null; playBtn.textContent = "▶ Auto"; };
    const play = () => {
      if (timer) return stop();
      if (cur >= steps.length - 1) go(-1);
      playBtn.textContent = "⏸ Pause";
      go(cur + 1);
      timer = setInterval(() => { if (cur >= steps.length - 1) stop(); else go(cur + 1); }, 2800);
    };
    host.addEventListener("click", (e) => {
      const a = e.target.closest("[data-act]");
      if (a) {
        const act = a.dataset.act;
        if (act !== "play") stop();
        if (act === "next") go(cur + 1);
        if (act === "prev") go(cur - 1);
        if (act === "reset") go(-1);
        if (act === "play") play();
      }
      const b = e.target.closest(".st-list button");
      if (b) { stop(); go(+b.dataset.i); }
    });
    host.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); stop(); go(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); stop(); go(cur - 1); }
    });
    render();
    return { go };
  }

  /* --------------------------------------------------------- Checklists */
  /** <ul class="checklist" data-store="key">: ticks are remembered in this browser only. */
  function initChecklists() {
    $$(".checklist[data-store]").forEach((ul) => {
      const key = "sba-check-" + ul.dataset.store;
      let saved = [];
      try { saved = JSON.parse(store.get(key) || "[]"); } catch (e) { saved = []; }
      const boxes = $$("input[type=checkbox]", ul);
      boxes.forEach((b, i) => {
        b.checked = saved.includes(i);
        b.addEventListener("change", () => store.set(key, JSON.stringify(boxes.map((x, j) => (x.checked ? j : -1)).filter((j) => j >= 0))));
      });
    });
  }

  /* ------------------------------------------------------ Tooltips */
  function initTooltips() {
    const tt = document.createElement("div");
    tt.className = "tt";
    tt.setAttribute("role", "tooltip");
    document.body.appendChild(tt);
    let owner = null;
    const place = (x, y) => {
      const r = tt.getBoundingClientRect();
      let left = x + 14, top = y + 16;
      if (left + r.width > innerWidth - 8) left = x - r.width - 14;
      if (top + r.height > innerHeight - 8) top = y - r.height - 12;
      tt.style.left = Math.max(8, left) + "px";
      tt.style.top = Math.max(8, top) + "px";
    };
    const show = (el, x, y) => {
      const raw = el.getAttribute("data-tip");
      if (!raw) return;
      owner = el;
      const i = raw.indexOf(" — ");
      tt.innerHTML = i > 0 ? `<b>${esc(raw.slice(0, i))}</b> — ${esc(raw.slice(i + 3))}` : esc(raw);
      tt.classList.add("show"); place(x, y);
    };
    const hide = () => { owner = null; tt.classList.remove("show"); };
    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest && e.target.closest("[data-tip]");
      if (el && el !== owner) show(el, e.clientX, e.clientY);
      else if (!el) hide();
    });
    document.addEventListener("pointermove", (e) => { if (owner) place(e.clientX, e.clientY); });
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ------------------------------------------- Soft breaks in inline code */
  function softBreak(root) {
    const list = root.matches && root.matches(":not(pre) > code") ? [root] : $$(":not(pre) > code", root);
    list.forEach((c) => {
      if (c.dataset.soft || c.children.length) return;
      c.dataset.soft = "1";
      if (c.closest("td:first-child, th:first-child") && c.textContent.length <= 26) { c.classList.add("nowrap"); return; }
      if (c.textContent.length < 14) return;
      c.innerHTML = esc(c.textContent).replace(/([_./(]|::)(?=[^_./(:\s])/g, "$1<wbr>");
    });
  }

  /* --------------------------------------------------------- Boot */
  function boot() {
    initTooltips();
    renderHeader();
    initTheme();
    renderReferences();
    renderSidebar();
    decorateSections();
    renderPager();
    renderFooter();
    initGlobalSearch();
    initScrollspy();
    initTabs();
    renderStaticCode();
    initChecklists();
    softBreak(document.body);
    if (location.hash) {
      const jump = () => {
        const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView({ behavior: "instant", block: "start" });
      };
      if (document.readyState === "complete") setTimeout(jump, 0);
      else window.addEventListener("load", () => setTimeout(jump, 0), { once: true });
    }
  }

  window.SBA = { SITE, $, $$, esc, norm, slug, store, initTabs, tokenize, codeBlockHTML, parseMarks, renderCodeExplorer, renderStaticCode, wireCopy, picker, stepper, detailHTML, softBreak };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
