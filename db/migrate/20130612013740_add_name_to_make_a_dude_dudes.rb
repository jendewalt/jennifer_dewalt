class AddNameToMakeADudeDudes < ActiveRecord::Migration
  def change
    add_column :make_a_dude_dudes, :name, :string
  end
end
