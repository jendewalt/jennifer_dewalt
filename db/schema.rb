# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130829230455) do

  create_table "click_counter_buttons", :force => true do |t|
    t.integer  "clicks"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "glob_glob_globs", :force => true do |t|
    t.string   "name"
    t.integer  "size"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "keep_it_up_players", :force => true do |t|
    t.string   "name"
    t.integer  "score"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "king_of_comments_comments", :force => true do |t|
    t.string   "name"
    t.text     "content"
    t.integer  "votes"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "leave_a_note_notes", :force => true do |t|
    t.text     "content"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "liquor_likes_likes", :force => true do |t|
    t.integer  "liquor_likes_liquor_id"
    t.integer  "user_id"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
  end

  add_index "liquor_likes_likes", ["liquor_likes_liquor_id"], :name => "index_liquor_likes_likes_on_liquor_likes_liquor_id"
  add_index "liquor_likes_likes", ["user_id", "liquor_likes_liquor_id"], :name => "index_liquor_likes_likes_on_user_id_and_liquor_likes_liquor_id", :unique => true
  add_index "liquor_likes_likes", ["user_id"], :name => "index_liquor_likes_likes_on_user_id"

  create_table "liquor_likes_liquors", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "liquor_likes_likes_count"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  add_index "liquor_likes_liquors", ["liquor_likes_likes_count"], :name => "index_liquor_likes_liquors_on_liquor_likes_likes_count"

  create_table "make_a_dude_dudes", :force => true do |t|
    t.string   "name"
    t.text     "message"
    t.string   "color"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "must_write_pages", :force => true do |t|
    t.text     "content"
    t.string   "slug"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "must_write_pages", ["slug"], :name => "index_must_write_pages_on_slug"

  create_table "one_page_pages", :force => true do |t|
    t.text     "content"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "open_note_notes", :force => true do |t|
    t.string   "slug"
    t.text     "content"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "open_note_notes", ["slug"], :name => "index_open_note_notes_on_slug"

  create_table "pixshow_scraps", :force => true do |t|
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "pollsie_answers", :force => true do |t|
    t.integer  "votes"
    t.integer  "pollsie_poll_id"
    t.string   "content"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "pollsie_answers", ["pollsie_poll_id"], :name => "index_pollsie_answers_on_poll_id"
  add_index "pollsie_answers", ["votes"], :name => "index_pollsie_answers_on_votes"

  create_table "pollsie_polls", :force => true do |t|
    t.string   "slug"
    t.string   "question"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "pollsie_polls", ["slug"], :name => "index_pollsie_polls_on_slug"

  create_table "portrait_photos", :force => true do |t|
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "postbored_sites", :force => true do |t|
    t.text     "url"
    t.string   "title"
    t.integer  "user_id"
    t.string   "tag"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "postbored_sites", ["tag"], :name => "index_postbored_sites_on_postbored_sites_type"
  add_index "postbored_sites", ["user_id", "url"], :name => "index_postbored_sites_on_user_id_and_postbored_sites_url", :unique => true
  add_index "postbored_sites", ["user_id"], :name => "index_postbored_sites_on_user_id"

  create_table "salon_galleries", :force => true do |t|
    t.string   "slug"
    t.string   "title"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "salon_galleries", ["slug"], :name => "index_salon_galleries_on_slug"

  create_table "salon_photos", :force => true do |t|
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.integer  "salon_gallery_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  add_index "salon_photos", ["salon_gallery_id"], :name => "index_salon_photos_on_salon_gallery_id"

  create_table "serious_question_polls", :force => true do |t|
    t.integer  "this_votes"
    t.integer  "that_votes"
    t.integer  "self_votes"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "share_a_secret_secrets", :force => true do |t|
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "tiny_notes_notes", :force => true do |t|
    t.string   "content"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "tiny_notes_notes", ["user_id", "created_at"], :name => "index_tiny_notes_notes_on_user_id_and_created_at"

  create_table "todo_todos", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "user_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "todo_todos", ["user_id"], :name => "index_todo_todos_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "slug"
    t.boolean  "admin",                                :default => false
    t.string   "email",                                :default => "",    :null => false
    t.string   "encrypted_password"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                        :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.integer  "failed_attempts",                      :default => 0
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.string   "invitation_token",       :limit => 60
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit",                     :default => 10000
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
    t.datetime "created_at",                                              :null => false
    t.datetime "updated_at",                                              :null => false
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.text     "description"
    t.string   "name"
  end

  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token", :unique => true
  add_index "users", ["name"], :name => "index_users_on_name"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["slug"], :name => "index_users_on_slug", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true
  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

  create_table "view_graph_views", :force => true do |t|
    t.float    "x"
    t.float    "y"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "word_cloud_words", :force => true do |t|
    t.string   "word_text"
    t.integer  "count"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "word_cloud_words", ["count"], :name => "index_word_cloud_words_on_count"

end
