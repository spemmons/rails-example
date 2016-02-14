class CreateJogTimes < ActiveRecord::Migration
  def change
    create_table  :jog_times do |t|
      t.integer   :user_id
      t.datetime  :started_at
      t.datetime  :stopped_at
      t.float     :distance

      t.timestamps null: false
    end

    add_index :jog_times,[:user_id,:started_at]
  end
end
