class FixPollsieColumnName < ActiveRecord::Migration
  def change
    rename_column :pollsie_answers, :poll_id, :pollsie_poll_id
  end
end

