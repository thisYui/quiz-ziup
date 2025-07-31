Rails.application.routes.draw do
  # Define the root path
  mount ActionCable.server => '/cable'

  # Image upload route
  get '/storage/:id/:filename(.:format)',     to: 'files#show'

  namespace :auth do
    post "login",                             to: "authentication#login"
    post "register",                          to: "authentication#register"
    post "send_otp",                          to: "authentication#send_otp"
    post "confirm_otp",                       to: "authentication#confirm_otp"
    post "renew_token",                       to: "authentication#renew_token"
    post "logout",                            to: "authentication#logout"
  end

  namespace :quiz do
    namespace :question do
      scope ":question_id" do
        # Question actions
        post "update",                            to: "general#update"

        # Choice actions
        post "choice/add_option",                 to: "choice#add_option"
        post "choice/remove_option",              to: "choice#remove_option"
        post "choice/choice_result",              to: "choice#choice_result"

        # Matching actions
        post "match/add_option",                  to: "matching#add_option"
        post "match/remove_option",               to: "matching#remove_option"
        post "match/add_result",                  to: "matching#add_result"
        post "match/remove_result",               to: "matching#remove_result"

        # Fill in actions
        post "fill/add_result",                   to: "fill_in#add_result"
        post "fill/remove_result",                to: "fill_in#remove_result"
      end
    end

  # Join actions
    post "join",                               to: "join#join"
    post ":quiz_id/get",                       to: "join#get"
    post ":quiz_id/submit",                    to: "join#submit"

    # Owner actions
    post ":quiz_id/open",                      to: "owners#open"
    post ":quiz_id/start",                     to: "owners#start"
    post ":quiz_id/show_result_question",      to: "owners#show_result_question"
    post ":quiz_id/next",                      to: "owners#next"
    post ":quiz_id/final",                     to: "owners#final"

    # Create actions
    post "create",                             to: "create#create"
    post ":quiz_id/delete",                    to: "create#delete"
    post ":quiz_id/add_question",              to: "create#add_question"
    post ":quiz_id/remove_question",           to: "create#remove_question"
    post ":quiz_id/hide_question",             to: "create#hide_question"
    post ":quiz_id/show_question",             to: "create#show_question"

    # Update actions
    post ":quiz_id/update_title",              to: "update#update_title"
    post ":quiz_id/update_description",        to: "update#update_description"
    post ":quiz_id/update_code",               to: "update#update_code"
    post ":quiz_id/update_key",                to: "update#update_key"
    post ":quiz_id/update_topic",              to: "update#update_topic"
    post ":quiz_id/update_max_participants",   to: "update#update_max_participants"

    # View actions
    post ":quiz_id/show",                      to: "view#show"
    post ":quiz_id/get_content_quiz",          to: "view#get_content_quiz"
    post ":quiz_id/info_session",              to: "view#info_session"
    post ":quiz_id/statistical",               to: "view#statistical"
  end

  namespace :account do
    # Getting actions
    post ":user_id/information",               to: "getting#information"
    post ":user_id/owner_quiz",                to: "getting#owner_quiz"
    get ":user_id/quiz_outstanding",           to: "getting#quiz_outstanding"
    post ":user_id/history",                   to: "getting#history"
    post ":user_id/show_quiz",                 to: "getting#show_quiz"

    # Settings actions
    post ":user_id/update_avatar",             to: "setting#update_avatar"
    post ":user_id/update_name",               to: "setting#update_name"
    post ":user_id/update_email",              to: "setting#update_email"
    post ":user_id/update_password",           to: "setting#update_password"
    post ":user_id/delete",                    to: "setting#delete"
  end
end
