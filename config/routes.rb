JenniferDewalt::Application.routes.draw do

  devise_for :users

  root :to => 'pages#home'

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
