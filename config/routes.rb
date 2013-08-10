JenniferDewalt::Application.routes.draw do

  devise_for :users

  root :to => 'pages#home'

  namespace :word_cloud do 
    resources :words, :only => [:index, :create]
  end

  namespace :cat_wall do 
    resources :page, :only => [:index, :create]
  end

  namespace :photobooth do 
    resources :page, :only => [:index]
  end

  namespace :here do 
    resources :page, :only => [:index, :create]
  end

  namespace :share_a_secret do 
    resources :secrets, :only => [:index, :create]
  end

  namespace :picnic do 
    resources :blanket, :only => [:index]
  end

  namespace :confused_twitter do 
    resources :tweets, :only => [:index]
  end

  namespace :screwdriver do 
    resources :page, :only => [:index]
  end

  namespace :plinky do 
    resources :game, :only => [:index]
  end

  namespace :balloon do 
    resources :page, :only => [:index]
  end

  namespace :brick_smasher do 
    resources :players, :only => [:index]
  end

  namespace :button_maker do 
    resources :page, :only => [:index]
  end

  namespace :todo do 
    resources :todos
  end

  namespace :mishmosh do 
    resources :page, :only => [:index]
  end

  namespace :forest do 
    resources :page, :only => [:index]
  end

  namespace :glob_glob do 
    resources :globs, :only => [:show, :update]
  end

  namespace :splodin_bacon do 
    resources :page, :only => [:index]
  end

  namespace :image_palette do 
    resources :page, :only => [:index]
  end

  namespace :window_sizer do 
    resources :game, :only => [:index]
  end

  namespace :check_sketch do 
    resources :page, :only => [:index]
  end

  namespace :down_the_weight do 
    resources :weights, :only => [:index]
  end

  namespace :effects do 
    resources :page, :only => [:index]
  end

  namespace :colorworks do 
    resources :page, :only => [:index]
  end

  namespace :algae_tank do 
    resources :board, :only => [:index]
  end

  namespace :serious_question do 
    resources :polls, :only => [:edit, :update, :show]
  end

  namespace :wish do 
    resources :page, :only => [:index]
  end

  namespace :infinite_descent do 
    resources :page, :only => [:index]
  end

  namespace :word_clock do 
    resources :page, :only => [:index]
  end

  namespace :drying_paint do 
    resources :wall, :only => [:index]
  end

  namespace :globulator do 
    resources :page, :only => [:index]
  end

  namespace :song_machine do 
    resources :page, :only => [:index]
  end

  namespace :tos do 
    resources :page, :only => [:index]
  end

  namespace :no_one_watching do 
    resources :page, :only => [:index]
  end

  namespace :emergency_off do 
    resources :button, :only => [:index]
  end

  namespace :text_to_braille do 
    resources :converter, :only => [:index]
  end

  namespace :postbored do 
    resources :sites
  end

  namespace :sparklers do 
    resources :sparklers, :only => [:index]
  end

  namespace :mastermind do 
    resources :game, :only => [:index]
  end

  namespace :swivel do 
    resources :game, :only => [:index]
  end

  namespace :typing_test do 
    resources :tests, :only => [:index]
  end

  namespace :pinwheel do 
    resources :pinwheel, :only => [:index]
  end

  namespace :skinny_drinks do 
    resources :calc, :only => [:index]
  end

  namespace :hourglass do 
    resources :timer, :only => [:index]
  end

  namespace :quick_words do 
    resources :game, :only => [:index]
  end

  namespace :countdown do 
    resources :clock, :only => [:index]
  end

  namespace :snare do 
    resources :snare, :only => [:index]
  end

  namespace :fishy_friend do 
    resources :fish, :only => [:index]
  end

  namespace :liquor_likes do 
    resources :liquors
    resources :likes
  end

  namespace :hollywood do 
    resources :sign, :only => [:index]
  end

  namespace :text_scroller do 
    resources :streams, :only => [:index]
  end

  namespace :capture do 
    resources :games, :only => [:index]
  end

  namespace :tiny_notes do 
    resources :notes
  end

  namespace :pv_calculator do 
    resources :calculators, :only => [:index]
  end

  namespace :hangman do 
    resources :game, :only => [:index]
  end

  namespace :your_space do
    resources :users
  end

  namespace :pixshow do
    resources :scraps
  end

  namespace :king_of_comments do
    resources :comments
  end

  namespace :view_graph do
    resources :views
  end

  namespace :keep_it_up do
    resources :players
  end

  namespace :make_a_dude do
    resources :dudes
  end

  namespace :one_page do
    resources :pages
  end
  
  namespace :click_counter do
    resources :buttons
  end

  namespace :leave_a_note do
    resources :notes, :only => [:index, :create]
  end
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end


  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
