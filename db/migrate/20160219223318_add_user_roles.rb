class AddUserRoles < ActiveRecord::Migration
  def change
    add_column :users,:roles,:integer,null: false,default: 0
  end
end
