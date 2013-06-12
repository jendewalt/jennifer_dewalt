class DropDudesTable < ActiveRecord::Migration
  def up
    drop_table :make_a_dude_dudes
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
