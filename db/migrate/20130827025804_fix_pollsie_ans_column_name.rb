class FixPollsieAnsColumnName < ActiveRecord::Migration
  def change
    rename_column :pollsie_answers, :text, :content
  end
end
