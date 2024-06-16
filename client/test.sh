curl --location --request GET 'https://17u8uun009.execute-api.us-east-1.amazonaws.com/dev/pred?text=hi'

curl --location --request GET 'https://wpxmafpmjf.execute-api.us-east-1.amazonaws.com/dev/pred?text=hi'

xvfb-run -a --server-args="-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" npm test