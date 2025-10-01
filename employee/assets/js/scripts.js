function loadStyle(e, o) {
  for (var t = 0; t < document.styleSheets.length; t++) if (document.styleSheets[t].href == e) return;
  var a = document.getElementsByTagName("head")[0],
    r = document.createElement("link");
  (r.rel = "stylesheet"),
    (r.type = "text/css"),
    (r.href = e),
    o &&
      (r.onload = function () {
        o();
      });
  var l = $(a).find('[href$="main.css"]');
  0 !== l.length ? l[0].before(r) : a.appendChild(r);
}
!(function (e) {
  e().dropzone && (Dropzone.autoDiscover = !1);
 
  var o = "dore.light.bluenavy.min.css",
    t = "ltr",
    a = "rounded";
  function r() {
    e("body").addClass(t), e("html").attr("dir", t), e("body").addClass(a), e("body").dore();
  }
  "undefined" != typeof Storage &&
    (localStorage.getItem("dore-theme-color") ? (o = localStorage.getItem("dore-theme-color")) : localStorage.setItem("dore-theme-color", o),
    localStorage.getItem("dore-direction") ? (t = localStorage.getItem("dore-direction")) : localStorage.setItem("dore-direction", t),
    localStorage.getItem("dore-radius") ? (a = localStorage.getItem("dore-radius")) : localStorage.setItem("dore-radius", a)),
    e(".theme-color[data-theme='" + o + "']").addClass("active"),
    e(".direction-radio[data-direction='" + t + "']").attr("checked", !0),
    e(".radius-radio[data-radius='" + a + "']").attr("checked", !0),
    e("#switchDark").attr("checked", o.indexOf("dark") > 0),
    loadStyle("assets/css/" + o, function () {
      setTimeout(r, 300);
    }),
    e("body").on("click", ".theme-color", function (o) {
      o.preventDefault();
      var t = e(this).data("theme");
      "undefined" != typeof Storage && (localStorage.setItem("dore-theme-color", t), window.location.reload());
    }),
    e("input[name='directionRadio']").on("change", function (o) {
      var t = e(o.currentTarget).data("direction");
      "undefined" != typeof Storage && (localStorage.setItem("dore-direction", t), window.location.reload());
    }),
    e("input[name='radiusRadio']").on("change", function (o) {
      var t = e(o.currentTarget).data("radius");
      "undefined" != typeof Storage && (localStorage.setItem("dore-radius", t), window.location.reload());
    }),
    e("#switchDark").on("change", function (t) {
      var a = e(t.currentTarget)[0].checked ? "dark" : "light";
      "dark" == a ? (o = o.replace("light", "dark")) : "light" == a && (o = o.replace("dark", "light")),
        "undefined" != typeof Storage && (localStorage.setItem("dore-theme-color", o), window.location.reload());
    }),
    e(".theme-button").on("click", function (o) {
      o.preventDefault(), e(this).parents(".theme-colors").toggleClass("shown");
    }),
    e(document).on("click", function (o) {
      e(o.target).parents().hasClass("theme-colors") ||
        e(o.target).parents().hasClass("theme-button") ||
        e(o.target).hasClass("theme-button") ||
        e(o.target).hasClass("theme-colors") ||
        (e(".theme-colors").hasClass("shown") && e(".theme-colors").removeClass("shown"));
    });
})(jQuery);
