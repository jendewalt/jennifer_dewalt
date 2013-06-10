class CreateClickCounterButtons < ActiveRecord::Migration
  def change
    create_table :click_counter_buttons do |t|
      t.integer :clicks

      t.timestamps
    end
  end
end
