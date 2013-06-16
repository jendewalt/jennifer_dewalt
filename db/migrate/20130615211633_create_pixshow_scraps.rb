class CreatePixshowScraps < ActiveRecord::Migration
  def change
    create_table :pixshow_scraps do |t|
      t.attachment :photo

      t.timestamps
    end
  end
end
