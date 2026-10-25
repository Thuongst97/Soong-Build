/* Module 01 — interactive build pipeline */
(function () {
  const { $, picker } = window.SBA;
  picker($("#pl-pick"), {
    m: {
      title: "m, mm, mmm — the shell entry points",
      tags: [["envsetup.sh"], ["shell function", "gray"]],
      html: `<p><code>m</code> is a shell function defined by <code>build/envsetup.sh</code>. It finds the top of the tree and calls <code>build/soong/soong_ui.bash --make-mode</code> with your targets. <code>mm</code> builds the modules in the current directory, <code>mmm dir/</code> those in a given directory.</p>`,
      code: `source build/envsetup.sh
lunch aosp_cf_x86_64_auto-trunk_staging-userdebug
m              # default goal "droid": everything in the product
m libgreet     # one module (and its dependencies)
m nothing      # run generators only — fastest way to validate Android.bp edits`,
    },
    ui: {
      title: "soong_ui — orchestrator",
      tags: [["build/soong/ui"], ["Go", "green"]],
      html: `<p>Checks the environment (disk, ulimits, banned host tools on <code>PATH</code>), sets up a sandboxed <code>PATH</code> with only allowed tools, then drives each stage. Everything it does is logged in <code>out/soong.log</code> and <code>out/verbose.log.gz</code>; the first failure is copied to <code>out/error.log</code>.</p>`,
    },
    config: {
      title: "Product configuration",
      tags: [["Kati"], ["Make", "amber"]],
      html: `<p>Kati evaluates <code>AndroidProducts.mk</code>, the selected product makefile and everything it inherits, plus <code>BoardConfig.mk</code>. The resulting variables (<code>PRODUCT_PACKAGES</code>, <code>TARGET_ARCH</code>, <code>BOARD_*</code>, Soong config variables…) are written as JSON for Soong.</p>`,
      code: `get_build_var TARGET_DEVICE          # ask the product config a question
get_build_var PRODUCT_PACKAGES | tr ' ' '\\n' | head
cat out/soong/soong.$TARGET_PRODUCT.variables | head -40`,
    },
    bootstrap: {
      title: "Bootstrap — building the build system",
      tags: [["minibp"], ["prebuilts/go", "purple"]],
      html: `<p>Soong itself is Go code. A tiny bootstrap step (<code>microfactory</code> + <code>minibp</code>) compiles <code>soong_build</code> with the prebuilt Go toolchain, including any <code>bootstrap_go_package</code> plugins from vendor trees (Module 06). Changing Soong's Go code therefore triggers this step.</p>`,
    },
    soong: {
      title: "soong_build — Android.bp to Ninja",
      tags: [["Blueprint"], ["out/soong/build.<product>.ninja", "green"]],
      html: `<p>Parses every <code>Android.bp</code> (found via <code>Android.bp</code> globs, respecting <code>PRODUCT_SOONG_NAMESPACES</code>), runs mutators to create variants, resolves dependencies, then asks each module to generate its build actions. It also writes a Make fragment so <code>Android.mk</code> code can refer to Soong modules.</p>
        <ul><li>Unknown property / module type → error here, before compiling anything.</li><li>Missing dependency → error here (unless <code>ALLOW_MISSING_DEPENDENCIES=true</code>).</li></ul>`,
    },
    kati: {
      title: "Kati build & packaging",
      tags: [["ckati"], ["out/build-<product>.ninja", "amber"]],
      html: `<p>A second Kati run reads all <code>Android.mk</code> files plus Soong's generated <code>Android-&lt;product&gt;.mk</code> and writes Ninja rules for Make-defined modules. A third run creates packaging rules: staging directories, file lists and image creation (<code>system.img</code>, <code>super.img</code>…).</p>`,
    },
    combine: {
      title: "Combine",
      tags: [["out/combined-<product>.ninja", "red"]],
      html: `<p>A tiny Ninja file that <code>subninja</code>s the Soong, Kati and packaging manifests so Ninja sees a single graph. This is the file to pass to <code>ninja -f</code> when you query the graph (Module 07).</p>`,
    },
    ninja: {
      title: "Ninja — run what's out of date",
      tags: [["prebuilts/build-tools"], ["parallel", "red"]],
      html: `<p>Ninja compares outputs with inputs <em>and</em> with the exact command line recorded in <code>.ninja_log</code>, so changing a flag rebuilds the affected files. Parallelism defaults to the CPU count; override with <code>m -j32</code>. The status line shows <code>[ 42% 51234/121000]</code>.</p>`,
      code: `m -j$(nproc) droid
m showcommands libgreet   # print every command Ninja runs`,
    },
    images: {
      title: "Partition staging & images",
      tags: [["$ANDROID_PRODUCT_OUT"], ["*.img", "green"]],
      html: `<p>Installed files are copied into <code>out/target/product/&lt;device&gt;/{system,vendor,product,…}</code>, then image tools (<code>mkuserimg_mke2fs</code>, <code>mkbootimg</code>, <code>lpmake</code>, <code>avbtool</code>) turn the staging directories into flashable images. Module 08 covers each image in detail.</p>`,
      code: `ls $ANDROID_PRODUCT_OUT/*.img
m dist DIST_DIR=out/dist   # also produce target-files and image zips`,
    },
  }, "m");
})();
