ActiveAdmin.register JogTime do
  permit_params :user_id, :started_at, :stopped_at, :distance

  index do
    selectable_column
    id_column
    column :user
    column :started_at
    column :stoppped_at
    column :distance
    column :speed
    actions
  end

  filter :user
  filter :started_at
  filter :stopped_at

end
