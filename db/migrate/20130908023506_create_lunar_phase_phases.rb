class CreateLunarPhasePhases < ActiveRecord::Migration
  def change
    create_table :lunar_phase_phases do |t|
      t.integer :moon_age
      t.integer :percent_illuminated

      t.timestamps
    end
  end
end
