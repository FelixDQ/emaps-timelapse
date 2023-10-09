# Remotion video

### How to run

```
# Download data
gsutil -m cp 'gs://dataportal/latest/*-2022-daily.csv' ./data

# Convert to json
python convert_data.py

# install dependencies
pnpm install

# run
pnpm start
```