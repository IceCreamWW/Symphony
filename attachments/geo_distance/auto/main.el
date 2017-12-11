(TeX-add-style-hook
 "main"
 (lambda ()
   (TeX-run-style-hooks
    "head")
   (LaTeX-add-bibitems
    "geo"))
 :latex)

