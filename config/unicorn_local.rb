# 2 workers and 1 master
worker_processes 2

working_directory "/Users/jen/src/jennifer_dewalt"

# Preload our app for more speed
preload_app true

listen '/Users/jen/src/jennifer_dewalt/shared/tmp/unicorn.sock', :backlog => 64

# Restart any workers that haven't responded in 30 seconds
timeout 30

# user 'root'

pid '/Users/jen/src/jennifer_dewalt/shared/pids/unicorn.pid'
stderr_path "/Users/jen/src/jennifer_dewalt/shared/tmp/log/unicorn.stderr.log"
stdout_path "/Users/jen/src/jennifer_dewalt/shared/tmp/log/unicorn.stdout.log"

# TODO copy on wrtie garbage collection when available

before_fork do |server, worker|
  # recomended for "preload_app true"
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
  end

  old_pid = '/Users/jen/src/jennifer_dewalt/shared/pids/unicorn.pid.oldbin'

  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end
end

after_fork do |server, worker|
  # required for "preload_app true",
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    ActiveRecord::Base.verify_active_connections!
  end

  # if preload_app is true, then you may also want to check and
  # restart any other shared sockets/descriptors such as Redis.   
end