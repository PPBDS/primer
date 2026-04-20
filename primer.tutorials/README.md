
<!-- README is generated from README.Rmd, edit ONLY this file if needed. But, after you edit it, you NEED TO KNIT IT BY HAND in order to create the new README.md, which is the thing which is actually used. -->

# Tutorials for *Primer for Bayesian Data Science* <img src="man/figures/ulysses_hex_tutorials.png" align = "right"  width="160">

<!-- badges: start -->

[![R build
status](https://github.com/PPBDS/primer.tutorials/workflows/R-CMD-check/badge.svg)](https://github.com/PPBDS/primer.tutorials/actions)
<!-- badges: end -->

## About this package

`primer.tutorials` provides the tutorials used in the *[Primer for
Bayesian Data Science](https://ppbds.github.io/primer)*.

## Installation

You can install the development version from
[GitHub](https://github.com/) with:

``` r
# install.packages("remotes")
remotes::install_github("PPBDS/primer.tutorials")
```

For suggested updates during installation, though you do not have to
have the latest versions of packages, it is recommended you update them.
For packages that need compilation, feel free to answer “no”.

Then **restart your R session** or **restart RStudio**.

## Accessing tutorials

In order to access the tutorials, start by loading the package.

``` r
library(primer.tutorials)
```

 

You can access the tutorials via the Tutorial pane in the top right tab
in RStudio.

If any of the following is happening to you
<ul>
<li>
Cannot find the Tutorial pane
</li>
<li>
Cannot find a tutorial called “Getting Started”
</li>
</ul>

Then **remember to restart your R session** after installing the
package.

Click “Start tutorial”. If you don’t see any tutorials, try clicking the
“Home” button – the little house symbol with the thin red roof in the
upper right.

 

<img src="man/figures/tutorial_pane.gif" width="75%" style="display: block; margin: auto;" />

 

In order to expand the window, you can drag and enlarge the tutorial
pane inside RStudio. In order to open a pop-up window, click the “Show
in New Window” icon next to the home icon.

You may notice that the Jobs tab in the lower left will create output as
the tutorial is starting up. This is because RStudio is running the code
to create the tutorial. If you accidentally clicked “Start Tutorial” and
would like to stop the job from running, you can click the back arrow in
the Jobs tab, and then press the red stop sign icon. Your work will be
saved between RStudio sessions, meaning that you can complete a tutorial
in multiple sittings. Once you have completed a tutorial, follow the
instructions on the tutorial `Submit` page and (if you’re a student)
submit the downloaded `rds` file as instructed.

## Re-installation

Since these tutorials are constantly being updated, it is likely that
updates will come out as you use these tutorials.

If you wish to stay up-to-date with the latest version, it is
recommended that you regularly re-install this tutorial package by
running the following 2 lines of code in your **R Console**:

``` r
remove.packages("primer.tutorials")
remotes::install_github("PPBDS/primer.tutorials")
```

For version updates for dependency packages please follow the same
considerations as discussed above in the Installation section.

And remember to **RESTART YOUR R SESSION** after you re-installed the
package.
