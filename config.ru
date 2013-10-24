$stdout.sync = true

use Rack::Static,
  :urls => ["/js", "/css"],
  :root => "tests"

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('tests/1-4-1.htm', File::RDONLY)
  ]
}

