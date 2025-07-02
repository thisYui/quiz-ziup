Rails.application.routes.draw do
  namespace :auth do
    post "login",             to: "authentication#login"
    post "register",          to: "authentication#register"
    post "send_otp",          to: "authentication#send_otp"
    post "confirm_otp",       to: "authentication#confirm_otp"
    delete "logout",          to: "authentication#logout"
  end

  namespace :quiz do
    # Join actions
    post "join",              to: "join#join"
    post "submit_answer",     to: "join#submit"

    # Create actions
    post "create",            to: "create#create"
    post "add_question",      to: "create#add_question"
    post "remove_question",   to: "create#remove_question"

    # Update actions
    post "update_name",       to: "update#update_name"
    post "update_description",to: "update#update_description"
    post "update_code",       to: "update#update_code"
    post "update_status",     to: "update#update_status"
    post "update_topic",      to: "update#update_topic"
    post "update_question",   to: "update#update_question"

    # Start actions
    post "start",             to: "start#start"
    post "end",               to: "start#end"

    # View actions
    post "show",              to: "view#show"
    post "statistical",       to: "view#statistical"
  end

  namespace :account do
    post "information",       to: "getting#get_information"
    post "all_quiz",          to: "getting#all_quiz"
    post "quiz_outstanding",  to: "getting#quiz_outstanding"


    # Settings actions
    post "update_avatar",     to: "setting#update_avatar"
    post "update_name",       to: "setting#update_name"
    post "update_email",      to: "setting#update_email"
    post "update_password",   to: "setting#update_password"
    post "delete_account",    to: "setting#delete_account"
  end

end
