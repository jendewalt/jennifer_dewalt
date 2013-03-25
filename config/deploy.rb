require "bundler/capistrano"
#require 'thinking_sphinx/deploy/capistrano'

set :application, "jennifer_dewalt"

set :repository,  "git@github.com:jendewalt/jennifer_dewalt.git"

set :deploy_to, "/home/deployer/jennifer_dewalt"

set :scm, :git
set :branch, "master"
set :deploy_via, :remote_cache
 
role :app, "54.225.161.137"                              # This may be the same as your `Web` server
role :web, "54.225.161.137"                              # This may be the same as your `Web` server
role :db,  "54.225.161.137", :primary => true # This is where Rails migrations will run

set :user, "deployer" #this is your username for the server in role: app etc.

set :use_sudo, false
set :rails_env, "production"

before 'deploy:update_code', 'unicorn:stop'
before 'deploy:update_code', 'resque:stop'

before 'deploy:restart', 'god:start'

namespace :deploy do
  namespace :assets do
    task :symlink do
      run "mkdir -p #{shared_path}/assets && chmod g+w #{shared_path}/assets"
      run "rm -rf #{shared_path}/assets"
      run "ln -nfs #{release_path}/public/assets #{shared_path}"
    end
    task :precompile do
    end
    task :clean do
    end
  end
end

namespace :unicorn do
  task :stop, :roles => :app, :except => { :no_release => true } do 
    run "sudo god stop unicorn"
    run "sudo god remove unicorn"
  end
end

namespace :resque do
  task :stop, :roles => :app, :except => { :no_release => true } do 
    run "sudo god stop resque"
    run "sudo god remove resque"
  end
end

namespace :god do
  task :start, :roles => [:app] do
    run "sudo god load /etc/god/god.conf"
  end
end

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"
