Rails.application.routes.draw do
  # Image upload route
  get '/storage/:id/:filename(.:format)',     to: 'files#show'

  namespace :auth do
    post "login",                     to: "authentication#login"
    post "register",                  to: "authentication#register"
    post "send_otp",                  to: "authentication#send_otp"
    post "confirm_otp",               to: "authentication#confirm_otp"
    post "renew_token",               to: "authentication#renew_token"
    delete "logout",                  to: "authentication#logout"
  end

  namespace :quiz do
    namespace :question do
      # Information general for all questions
      resources :general do
        member do
          # Bao gồm về các nội dung có thể thay đổi toàn bộ sẽ được update
          post "update",              to: "general#update"
        end
      end

      # Choice question actions
      resources :choice do
        member do
          # Debounce các action này để tránh việc gửi quá nhiều request
          post "update_content",      to: "choice#update_content"

          # Not real-time
          post "add_option",          to: "choice#add_option"
          post "remove_option",       to: "choice#remove_option"
          post "choice_result",       to: "choice#choice_result"
        end
      end

      # Matching question actions
      resources :matching do
        member do
          # Debounce các action này để tránh việc gửi quá nhiều request
          post "update_content",      to: "choice#update_content"

          # Not real-time
          post "add_option",          to: "choice#add_option"
          post "remove_option",       to: "choice#remove_option"
          post "matching_result",     to: "choice#matching_result"
        end
      end

      # Fill in question actions
      resources :fill_in do
        member do
          # Debounce các action này để tránh việc gửi quá nhiều request
          post "update_content",      to: "choice#update_content"
        end
      end
    end

    # Join actions
    post "join",                      to: "join#join"
    post "submit",                    to: "join#submit"
    post "start",                     to: "join#start"
    post "end",                       to: "join#end"

    # Create actions
    post "create",                    to: "create#create"
    delete "delete",                  to: "create#delete"
    post "add_question",              to: "create#add_question"
    delete "remove_question",         to: "create#remove_question"

    # Update actions
    post "update_name",               to: "update#update_name"
    post "update_description",        to: "update#update_description"
    post "update_code",               to: "update#update_code"
    post "update_is_private",         to: "update#update_is_private"
    post "update_topic",              to: "update#update_topic"

    # View actions
    post "show",                      to: "view#show"
    post "info_session",              to: "view#info_session"
    post "statistical",               to: "view#statistical"
  end

  namespace :account do
    # Getting actions
    post "information",               to: "getting#get_information"
    post "owner_quiz",                to: "getting#owner_quiz"
    get "quiz_outstanding",           to: "getting#quiz_outstanding"
    post "history",                   to: "getting#history"
    
    # Settings actions
    post "update_avatar",             to: "setting#update_avatar"
    post "update_name",               to: "setting#update_name"
    post "update_email",              to: "setting#update_email"
    post "update_password",           to: "setting#update_password"
    delete "delete",                  to: "setting#delete"
  end
end
