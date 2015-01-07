# see distribution of distance values
SELECT euclidian_dist, count(*)
FROM diffs
GROUP BY euclidian_dist
ORDER BY euclidian_dist;

# see similarites for each person
SELECT raw1.name, raw2.name, diffs.euclidian_dist, diffs.orange_diff, diffs.gold_diff, diffs.green_diff, diffs.blue_diff
FROM diffs
  INNER JOIN raw raw1 ON (diffs.raw_id_1 = raw1.id)
  INNER JOIN raw raw2 ON (diffs.raw_id_2 = raw2.id)
ORDER BY
  raw1.name, euclidian_dist;

# who is most similar/different?
SELECT raw1.name, raw2.name, diffs.euclidian_dist, diffs.orange_diff, diffs.gold_diff, diffs.green_diff, diffs.blue_diff
FROM diffs
  INNER JOIN raw raw1 ON (diffs.raw_id_1 = raw1.id)
  INNER JOIN raw raw2 ON (diffs.raw_id_2 = raw2.id)
WHERE
  `unique` = 1
ORDER BY
  euclidian_dist, raw1.name, raw2.name

# who has the most overall similarity (smallest sum of differences)
SELECT raw.name, sum(euclidian_dist) AS total_dist
FROM diffs
  INNER JOIN raw ON (diffs.raw_id_1 = raw.id)
GROUP BY name
ORDER BY total_dist;
