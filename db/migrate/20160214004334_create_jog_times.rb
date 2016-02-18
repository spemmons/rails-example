class CreateJogTimes < ActiveRecord::Migration
  def change
    create_table  :jog_times do |t|
      t.integer   :user_id
      t.datetime  :date
      t.integer   :duration
      t.float     :distance

      t.timestamps null: false
    end

    add_index :jog_times,[:user_id,:date]
  end
end
