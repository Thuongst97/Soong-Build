# Soong Build Academy

Interactive documentation of the Android **Soong** build system. It starts with the basics (`Android.bp`, `lunch`, `m`) and ends with building and flashing a **complete head-unit SoC image** that combines:

- a **QNX Hypervisor** host,
- a **QNX instrument-cluster** guest,
- an **Android Automotive (AAOS)** guest built with Soong,
- a **Linux SE** guest (Yocto, SELinux enforcing).

It follows the same structure and look as the [AAOS 14 Academy](https://github.com/Thuongst97/Android-Knowledge): static HTML, a shared runtime for layout/search/code highlighting, light and dark themes, and interactive diagrams.

## Contents

| # | Module | Topics |
|---|--------|--------|
| 01 | Build System Overview | Make → Kati → Soong → Ninja, the `m` pipeline, variants, `out/` |
| 02 | Setup & First Build | Workstation, `repo` and local manifests, `envsetup.sh`, `lunch`, Cuttlefish, containers |
| 03 | Android.bp Language | Syntax, types, defaults, arch/target, `select()`, visibility, licenses, annotated example |
| 04 | Module Types Cookbook | cc, java/app, prebuilts, genrule, aidl_interface, rust, apex, partition placement |
| 05 | Product & Board Config | Device tree, `AndroidProducts.mk`, inheritance, `BoardConfig.mk`, release configs, Soong config variables |
| 06 | Extending Soong | `soong_namespace`, `soong_config_module_type`, Go plugins, Android.mk migration |
| 07 | Debugging & Performance | Logs, ninja queries, `module-info.json`, common errors, ccache, clean strategies |
| 08 | Partitions & Images | boot/init_boot/vendor_boot, super, AVB, A/B, target-files, signing |
| 09 | Kernel, GKI & Kleaf | GKI, Kleaf builds, DDK modules, DTB, prebuilt integration, virtio guest config |
| 10 | Head-Unit Architecture | SoC partitioning, inter-VM communication, boot budget, four toolchains |
| 11 | QNX Hypervisor Host | SDP, BSP, mkifs buildfile, qvm configs, vdevs, pass-through |
| 12 | QNX Cluster Guest | Guest IFS, Screen, early telltales/RVC, freedom from interference |
| 13 | Android (AAOS) Guest | Guest device tree, BoardConfig, fstab, virtio HALs, VHAL bridge, SELinux |
| 14 | Linux SE Guest (Yocto) | Layers, machine, SELinux, image recipe, outputs |
| 15 | Integration & Flashing | UFS layout, secure boot, end-to-end boot, `build_all.sh`, packing, flashing, multi-VM OTA, CI |
| A/B | Cheat Sheet, Glossary | |

## Run locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Publish

`.github/workflows/pages.yml` deploys `site/` to GitHub Pages on every push to `main` (and to the current default branch). Enable it once under **Settings → Pages → Source: GitHub Actions**.

## Layout

```
site/
├── index.html, <module>.html        one page per module
└── assets/
    ├── css/main.css                 theme + components
    └── js/
        ├── core.js                  site map, header, sidebar, search, highlighter, diagrams, stepper
        ├── glossary-data.js         glossary entries (also indexed by search)
        └── pages/*.js               page-specific interactive content
```

To add a page: copy an existing module page, add an entry to `SITE` (and optionally `REFS`) in `core.js`, and give every `<section class="doc-section">` an `id` that matches the `sections` list.

## Notes on accuracy

- Android content follows AOSP `main` / Android 15–16. Check paths and flags against the branch you build.
- QNX file names, driver names and `qvm` option spellings are **illustrative** — QNX SDP, the Hypervisor and SoC BSPs are licensed and differ between releases. Start from your BSP's samples.
- "Linux SE" is treated as a security-enhanced (SELinux-enforcing) Linux service VM built with Yocto.
- *Acme*, `acme_hu` and `acmesoc` are fictional example names.
