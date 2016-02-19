ActiveAdmin.register JogTime do
  permit_params :user_id, :date, :duration, :distance

  index do
    selectable_column
    id_column
    column :user
    column :date
    column :duration
    column :distance
    column :speed
    actions
  end

  filter :user
  filter :date
  filter :duration
  filter :distance

end
