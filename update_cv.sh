perl -pi -e "s/(?<=id=\"cv_revision\">)Revision \d+\. Last Updated: [a-zA-Z0-9 ]*(?=<\/h2>)/Revision $1. Last Updated: `date "+%b %-d %Y"`/g" src/cv.html
perl -pi -e "s/(?<=SHA-256 Checksum: )\w*/`shasum -a 256 src/cv.pdf | cut -d " " -f 1`/g" src/cv.html
