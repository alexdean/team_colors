require 'mysql2'
require 'json'
require 'logger'

def db
  $client ||= Mysql2::Client.new(
    host: "localhost",
    username: "root",
    database: "team_colors"
  )
end

def log
  if !defined?($log)
    $log ||= Logger.new($stderr)
    $log.level = Logger::INFO
  end
  $log
end

# return the string color name for the predominant color in a row of `raw` data
def color(row)
  row.
    select{|k,v| ['blue', 'green', 'gold', 'orange'].include?(k) }.
    sort_by{|k,v| v * -1}.
    first[0]
end

desc "create tables"
task :create_tables do
  sql = <<-EOF
  CREATE TABLE `raw` (
    `id` tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL DEFAULT '',
    `orange` tinyint(4) unsigned NOT NULL,
    `blue` tinyint(4) unsigned NOT NULL,
    `gold` tinyint(4) unsigned NOT NULL,
    `green` tinyint(4) unsigned NOT NULL,
    PRIMARY KEY (`id`)
  );
  EOF
  db.query sql

  sql = <<-EOF
  CREATE TABLE `diffs` (
    `raw_id_1` tinyint(4) unsigned NOT NULL,
    `raw_id_2` tinyint(4) unsigned NOT NULL,
    `orange_diff` tinyint(4) NOT NULL,
    `blue_diff` tinyint(4) NOT NULL,
    `gold_diff` tinyint(4) NOT NULL,
    `green_diff` tinyint(4) NOT NULL,
    `euclidian_dist` decimal(4,2) NOT NULL,
    `unique` tinyint(4) NOT NULL,
    PRIMARY KEY (`raw_id_1`,`raw_id_2`)
  );
  EOF
  db.query sql
end

desc "calculate diffs from raw data"
task :build_diffs do
  db.query "TRUNCATE TABLE diffs"
  raw = db.query("SELECT * FROM raw ORDER BY id").map{|row| row}

  raw.each do |r1|
    raw.each do |r2|
      next if r2['id'] == r1['id']

      unique = r1['id'] < r2['id']

      blue_diff   = r1['blue'] - r2['blue']
      orange_diff = r1['orange'] - r2['orange']
      gold_diff   = r1['gold'] - r2['gold']
      green_diff  = r1['green'] - r2['green']

      # http://en.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
      euclidian_dist = Math.sqrt(blue_diff**2 + orange_diff**2 + gold_diff**2 + green_diff**2)

      sql = <<-EOF
        INSERT INTO diffs (
          raw_id_1,
          raw_id_2,
          blue_diff,
          orange_diff,
          gold_diff,
          green_diff,
          euclidian_dist,
          `unique`
        ) VALUES (
          #{r1['id']},
          #{r2['id']},
          #{blue_diff},
          #{orange_diff},
          #{gold_diff},
          #{green_diff},
          #{euclidian_dist},
          #{unique}
        )
      EOF
      db.query(sql)
    end
  end
end

desc "export json data for visualization"
task export: :build_diffs do
  people = []
  db.query("SELECT * FROM raw").each do |row|
    people << row
  end
  File.open('data/people.json', 'w') {|f| f.write(people.to_json)}

  pie = []
  people.each do |p|
    pie << {
      id: p['id'],
      name: p['name'],
      color: color(p),
      colors: [
        {color:"orange", value:p['orange']},
        {color:"blue",   value:p['blue']},
        {color:"gold",   value:p['gold']},
        {color:"green",  value:p['green']}
      ]
    }
  end
  File.open('data/pie.json', 'w') {|f| f.write(pie.to_json)}

  min_dist = 1000
  max_dist = -1000
  result = []
  db.query("SELECT raw_id_1 as id1, raw_id_2 as id2, euclidian_dist as distance FROM diffs").each do |row|
    min_dist = [min_dist, row['distance'].to_f].min
    max_dist = [max_dist, row['distance'].to_f].max
    result << row
  end
  File.open('data/diffs.json', 'w') {|f| f.write(result.to_json)}

  # nodes must associate via index positions in `people`
  id_to_idx = {}
  pie.each_with_index do |item, idx|
    id_to_idx[item[:id]] = idx
  end

  result = {
    nodes: pie,
    links: [],
    meta: {
      min_dist: min_dist.to_f,
      max_dist: max_dist.to_f
    }
  }

  log.info "min_dist: #{min_dist}"
  log.info "max_dist: #{max_dist}"

  db.query("SELECT raw_id_1 as id1, raw_id_2 as id2, euclidian_dist as distance FROM diffs WHERE `unique` = 1").each do |row|
    # drop longest edges to allow significant connections to show more clearly
    # as the number of edges increases, the force layout has less chance of correctly arranging everything
    # so the chance of a signifcant distortion goes up.
    #
    # keeping short edges (showing close similarity) accurate is more important
    # than the very longest ones
    next if row['distance'] > (max_dist - (max_dist/4))

    result[:links] << {
      source: id_to_idx[row['id1']],
      target: id_to_idx[row['id2']],
      distance: row['distance'].to_f
    }
  end
  File.open('data/network.json', 'w') {|f| f.write(result.to_json)}


end

task default: :export
