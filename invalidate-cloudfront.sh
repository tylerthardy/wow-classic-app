export path1="/"
export path2="/*"
MSYS2_ARG_CONV_EXCL=\* aws cloudfront create-invalidation --distribution-id=E289BEDLGX4MLV --paths "$path1" "$path2"