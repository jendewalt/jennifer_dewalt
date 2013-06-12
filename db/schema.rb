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

ActiveRecord::Schema.define(:version => 20130612013740) do

  create_table "click_counter_buttons", :force => true do |t|
    t.integer  "clicks"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "leave_a_note_notes", :force => true do |t|
    t.text     "content"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "make_a_dude_dudes", :force => true do |t|
    t.string   "color"
    t.integer  "size"
    t.string   "message"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "name"
  end

  create_table "one_page_pages", :force => true do |t|
    t.text     "content"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
