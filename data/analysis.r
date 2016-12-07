setwd("~/GitHub/bias-study/data") #machine-dependent... sorry. probably a better way of doing this
library(ggplot2)
library(mefa)
library(lsmeans)

bias_data <- read.csv("cleaned_data.csv")
#Select the columns for statistics
id <- rep(as.vector(t(bias_data["id"])), each=2)#airline, states
condition <- rep(as.vector(t(bias_data["studyCondition"])), each=2)#airline, states
visType <- rep(c("airline", "states"), nrow(bias_data))
focus <- as.vector(t(bias_data[c("focusAirline", "focusState")]))
sequence <- as.vector(t(bias_data[c("seqAirline", "seqStates")]))
order <- ifelse(rep(as.vector(t(bias_data["firstCondition"])), each=2) == visType, 1, 2)#airline, states
cleaned_data_frame <- data.frame(id, condition, visType, focus, sequence, order)

#-----How many questions when viewing the precise data-----
how_many_precise <- cleaned_data_frame
#Calcualte approximate error
approx_howMany_answer <- as.vector(t(bias_data[c("approx_airline_howMany_answer", "approx_states_howMany_answer")]))
approx_howMany_approx <- as.vector(t(bias_data[c("approx_airline_howMany_approx", "approx_states_howMany_approx")]))
precise_howMany_precise <- as.vector(t(bias_data[c("precise_airline_howMany_precise", "precise_states_howMany_precise")]))
precise_howMany_answer <- as.vector(t(bias_data[c("precise_airline_howMany_answer", "precise_states_howMany_answer")]))

how_many_precise$approximate_error <- (approx_howMany_answer - approx_howMany_approx)/ approx_howMany_approx
how_many_precise$expected_bias <- (precise_howMany_precise - approx_howMany_approx)/ precise_howMany_precise
how_many_precise$measured_bias <- (precise_howMany_precise - precise_howMany_answer)/ precise_howMany_precise

#One would hope we can remove: visType, focus, sequence, order
#how_many_precise <- how_many_precise[c(T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, F, T, T, T),] #remove outlier answer
how_many_precise_test <- lm(measured_bias ~ expected_bias + approximate_error + visType + condition + focus + sequence + order + (1 | id), data=how_many_precise)
how_many_precise_test <- lm(measured_bias ~ expected_bias*condition + approximate_error + (1 | id), data=how_many_precise)

how_many_precise_plot <- ggplot(how_many_precise, aes(expected_bias, measured_bias, color=condition)) + geom_point()
ggsave("plots/how_many_precise.png", how_many_precise_plot)

#-----Comparison questions when viewing the precise data-----
compare_precise <- rep(cleaned_data_frame, 2)
#Calculate approximate error (Only looking at the first approximate answer, since I think this was the intended behavior)

approx_compare_answer <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_answer", "approx_states_howManyCompare_0_answer")]))
approx_compare_approx <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_approx", "approx_states_howManyCompare_0_approx")]))
precise_compare_approx <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_approx", "precise_states_howManyCompare_0_approx", "precise_airline_howManyCompare_1_approx", "precise_states_howManyCompare_1_approx")]))
precise_compare_precise <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_precise", "precise_states_howManyCompare_0_precise", "precise_airline_howManyCompare_1_precise", "precise_states_howManyCompare_1_precise")]))
precise_compare_answer <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_answer", "precise_states_howManyCompare_0_answer", "precise_airline_howManyCompare_1_answer", "precise_states_howManyCompare_1_answer")]))
precise_compare_comparison <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_data", "precise_states_howManyCompare_0_data", "precise_airline_howManyCompare_1_data", "precise_states_howManyCompare_1_data")]))
approx_compare_comparison <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_data", "approx_states_howManyCompare_0_data")]))

compare_precise$approximate_error <- rep((approx_compare_answer - approx_compare_approx)/approx_compare_approx, 2)
compare_precise$expected_bias <- (precise_compare_precise - precise_compare_approx)/precise_compare_precise
compare_precise$measured_bias <- (precise_compare_precise - precise_compare_answer)/precise_compare_precise
compare_precise$approximate_comparison <- rep(approx_compare_comparison, 2)
compare_precise$precise_comparison <- rep(precise_compare_comparison)

#One would hope we can remove: visType, focus, sequence, order, approximate_comparison, precise_comparison
compare_precise_test <- lm(measured_bias ~ expected_bias + approximate_error + approximate_comparison + precise_comparison + visType + condition + focus + sequence + order + (1 | id), data=compare_precise)
compare_precise_test <- lm(measured_bias ~ expected_bias*condition + approximate_error + (1 | id), data=compare_precise)

compare_precise_plot <- ggplot(compare_precise, aes(expected_bias, measured_bias, color=condition)) + geom_point()
ggsave("plots/compare_precise.png", compare_precise_plot)

#-----Question of "how many of X were there?-----
jaccard_precise <- cleaned_data_frame

jaccard_precise$expected_bias <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_answer_precise", "precise_airline_SelectAll_jaccard_answer_precise")]))
jaccard_precise$approximate_error <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_approx_precise", "precise_airline_SelectAll_jaccard_approx_precise")]))
jaccard_precise$measured_bias <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_approx_answer", "precise_airline_SelectAll_jaccard_approx_answer")]))

jaccard_precise_test <- lm(expected_bias ~ approximate_error + measured_bias + condition + (1 | id), data=jaccard_precise)

jaccard_precise_plot <- ggplot(jaccard_precise, aes(expected_bias, measured_bias, color=condition)) + geom_jitter()
ggsave("plots/jaccard_precise_jitter.png", jaccard_precise_plot)
