class CreateShareASecretSecrets < ActiveRecord::Migration
  def change
    create_table :share_a_secret_secrets do |t|
      t.string :description

      t.timestamps
    end
  end
end
