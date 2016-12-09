setwd("~/GitHub/bias-study/data") #machine-dependent... sorry. probably a better way of doing this
library(ggplot2)
library(mefa)
library(lsmeans)
library(multcomp)

bias_data <- read.csv("cleaned_data.csv")
#Filter out the people who admitted to cheating
bias_data[bias_data$id %in% c("55686356", "49437914", "66972706", "80993444", "42878404", "23634915", "18074862", "84835951", "58926040", "55656520", "87912012", "30619584", "51665387", "25917069", "50263296", "60755967", "2893057", "28653725", "76648162", "21045111", "72925790", "88825154", "97626871", "29657674", "26308857", "79273300", "77642132", "83205605", "9782123", "28428523", "95378753", "62759895", "45694489", "57315921", "20505415", "73348785", "77955785", "45840218", "79707421", "7321301", "43548417", "89431160", "29089701", "61154389", "71996586", "21418137", "76395409", "79544988", "76024785"),]
#Select the columns for statistics
id <- rep(as.vector(t(bias_data["id"])), each=2)#airline, states
condition <- rep(as.vector(t(bias_data["studyCondition"])), each=2)#airline, states
condition <- factor(condition,c("onlyNew", "difference", "both"))
visType <- rep(c("airline", "states"), nrow(bias_data))
focus <- as.vector(t(bias_data[c("focusAirline", "focusState")]))
sequence <- as.vector(t(bias_data[c("seqAirline", "seqStates")]))
control <- factor(as.factor(ifelse(sequence == 1, 1, 0)), c("1", "0"))
order <- ifelse(rep(as.vector(t(bias_data["firstCondition"])), each=2) == visType, 1, 2)#airline, states
cleaned_data_frame <- data.frame(id, condition, visType, focus, sequence, order, control)

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
how_many_precise_test <- lm(measured_bias ~ control + expected_bias*condition + (1 | id), data=how_many_precise)

how_many_precise_plot <- ggplot(how_many_precise, aes(expected_bias, measured_bias, color=condition, fill=condition)) + theme(text = element_text(size=32)) + geom_point() + geom_smooth(se=T, method="lm")
ggsave("plots/how_many_precise.pdf", how_many_precise_plot)

how_many_precise_boxplot <- ggplot(how_many_precise, aes(condition, measured_bias)) + geom_boxplot()
ggsave("plots/how_many_precise_box.pdf", how_many_precise_boxplot)

#-----Comparison questions when viewing the precise data-----
compare_precise <- rep(cleaned_data_frame, 3)
#Calculate approximate error (Only looking at the first approximate answer, since I think this was the intended behavior)

approx_compare_answer <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_answer", "approx_states_howManyCompare_0_answer")]))
approx_compare_approx <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_approx", "approx_states_howManyCompare_0_approx")]))
precise_compare_approx <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_approx", "precise_states_howManyCompare_0_approx", "precise_airline_howManyCompare_1_approx", "precise_states_howManyCompare_1_approx", "precise_airline_howManyCompare_2_approx", "precise_states_howManyCompare_2_approx")]))
precise_compare_precise <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_precise", "precise_states_howManyCompare_0_precise", "precise_airline_howManyCompare_1_precise", "precise_states_howManyCompare_1_precise", "precise_airline_howManyCompare_2_precise", "precise_states_howManyCompare_2_precise")]))
precise_compare_answer <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_answer", "precise_states_howManyCompare_0_answer", "precise_airline_howManyCompare_1_answer", "precise_states_howManyCompare_1_answer", "precise_airline_howManyCompare_2_answer", "precise_states_howManyCompare_2_answer")]))
precise_compare_comparison <- as.vector(t(bias_data[c("precise_airline_howManyCompare_0_data", "precise_states_howManyCompare_0_data", "precise_airline_howManyCompare_1_data", "precise_states_howManyCompare_1_data", "precise_airline_howManyCompare_2_data", "precise_states_howManyCompare_2_data")]))
approx_compare_comparison <- as.vector(t(bias_data[c("approx_airline_howManyCompare_0_data", "approx_states_howManyCompare_0_data")]))

compare_precise$approximate_error <- rep((approx_compare_answer - approx_compare_approx)/approx_compare_approx, 3)
compare_precise$expected_bias <- (precise_compare_precise - precise_compare_approx)/precise_compare_precise
compare_precise$measured_bias <- (precise_compare_precise - precise_compare_answer)/precise_compare_precise
compare_precise$approximate_comparison <- rep(approx_compare_comparison, 3)
compare_precise$precise_comparison <- rep(precise_compare_comparison)

#One would hope we can remove: visType, focus, sequence, order, approximate_comparison, precise_comparison
compare_precise_test <- lm(measured_bias ~ expected_bias + approximate_error + approximate_comparison + precise_comparison + visType + condition + focus + sequence + order + (1 | id), data=compare_precise)
compare_precise_test <- lm(measured_bias ~ control + expected_bias*condition + (1 | id), data=compare_precise)

compare_precise_plot <- ggplot(compare_precise, aes(expected_bias, measured_bias, color=condition, fill=condition)) + theme(text = element_text(size=32)) + geom_point() + geom_smooth(se=T, method="lm")
ggsave("plots/compare_precise.pdf", compare_precise_plot)

compare_precise_boxplot <- ggplot(compare_precise, aes(condition, measured_bias)) + geom_boxplot()
ggsave("plots/compare_precise_box.pdf", compare_precise_boxplot)

#-----Question of "how many of X were there?-----
jaccard_precise <- cleaned_data_frame

jaccard_precise$expected_bias <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_answer_precise", "precise_airline_SelectAll_jaccard_answer_precise")]))
jaccard_precise$approximate_error <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_approx_precise", "precise_airline_SelectAll_jaccard_approx_precise")]))
jaccard_precise$measured_bias <- as.vector(t(bias_data[c("precise_states_SelectAll_jaccard_approx_answer", "precise_airline_SelectAll_jaccard_approx_answer")]))

jaccard_precise_test <- lm(measured_bias ~ control + expected_bias*condition + (1 | id), data=jaccard_precise)

jaccard_precise_plot <- ggplot(jaccard_precise, aes(expected_bias, measured_bias, color=condition, fill=condition)) + theme(text = element_text(size=32)) + geom_jitter() + geom_smooth(se=T, method="lm")
ggsave("plots/jaccard_precise_jitter.pdf", jaccard_precise_plot)

jaccard_precise_boxplot <- ggplot(jaccard_precise, aes(condition, measured_bias)) + geom_boxplot()
ggsave("plots/jaccard_precise_box.pdf", jaccard_precise_boxplot)
