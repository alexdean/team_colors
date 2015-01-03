# Team Colors

This is a simple visualization of the [True Colors personality test](https://en.wikipedia.org/wiki/True_Colors_(personality)).

It attempts to show which people in a group are most similar by placing them
near each other in a [force-directed layout](https://github.com/mbostock/d3/wiki/Force-Layout).

## Usage

  1. Create a mysql database and set the connection parameters in the `db` method in `Rakefile`.
  1. `rake create_tables`
  1. Enter your group's data into the `raw` table.
  1. `rake export`
  1. `ruby server.rb`
  1. Browse to http://localhost:8000/index.html

## Example

![screenshot of some sample output](http://img.deanspot.org/monosnap/a/localhost8000force_directed.html_2015-01-02_22-50.jpg)
