class CreateMakeADudeDudes < ActiveRecord::Migration
  def change
    create_table :make_a_dude_dudes do |t|
      t.string :name
      t.text :message
      t.string :color

      t.timestamps
    end
  end
end