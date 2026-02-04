#!/bin/bash
pandoc _data/references.bib -t csljson | jq '[.[] | . + {"sort_date": ((.issued["date-parts"][0][0] // 0) * 10000 + ((.issued["date-parts"][0][1] // 1) * 100) + (.issued["date-parts"][0][2] // 1))}]' > _data/references.json
