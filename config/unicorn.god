God.watch do |w|
  w.name = "unicorn"
  w.interval = 30.seconds
  w.start = "/etc/init.d/unicorn start"
  w.stop = "/etc/init.d/unicorn stop"
  w.restart = "/etc/init.d/unicorn restart"
  w.start_grace = 10.seconds
  w.restart_grace = 10.seconds
  w.pid_file = "/home/deployer/jennifer_dewalt/shared/pids/unicorn.pid"

  w.start_if do |start|
    start.condition(:process_running) do |c|
      c.interval = 5.seconds
      c.running = false
    end
    
    start.condition(:process_exits)
  end

  w.restart_if do |restart|
    restart.condition(:memory_usage) do |c|
      c.above = 300.megabytes
      c.times = [3, 5] # 3 out of 5 intervals
    end

    #~ restart.condition(:cpu_usage) do |c|
      #~ c.above = 50.percent
      #~ c.times = 5
    #~ end
  end

  # lifecycle
  w.lifecycle do |on|
    on.condition(:flapping) do |c|
      c.to_state = [:start, :restart]
      c.times = 5
      c.within = 5.minute
      c.transition = :unmonitored
      c.retry_in = 10.minutes
      c.retry_times = 5
      c.retry_within = 2.hours
    end
  end
end
