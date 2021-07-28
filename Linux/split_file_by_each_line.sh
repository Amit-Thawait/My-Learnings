export i=1;
while read p; do
echo "$p" > $i.txt;
let "i=i+1";
done <log_file_name.log
