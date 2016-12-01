setwd("~/GitHub/bias-study/data") #machine-dependent... sorry. probably a better way of doing this
library(reshape2)
library(ggplot2)

bias_data <- read.csv("bias-study-export.csv")
#Select the columns for statistics
id <- rep(as.vector(t(bias_data["id"])), each=2)#airline, states
condition <- rep(as.vector(t(bias_data["studyCondition"])), each=2)#airline, states
visType <- rep(c("airline", "states"), nrow(bias_data))
focus <- as.vector(t(bias_data[c("focusAirline", "focusState")]))
sequence <- as.vector(t(bias_data[c("seqAirline", "seqStates")]))
order <- ifelse(rep(as.vector(t(bias_data["firstCondition"])), each=2) == visType, 1, 2)#airline, states
cleaned_data_frame <- data.frame(id, condition, visType, focus, sequence, order)
how_many_precise <- cleaned_data_frame
#Calcualte approximate error
approx_howMany_answer <- as.vector(t(bias_data[c("approx.airline.howMany.answer", "approx.states.howMany.answer")]))
approx_howMany_approx <- as.vector(t(bias_data[c("approx.airline.howMany.approx", "approx.states.howMany.approx")]))
precise_howMany_precise <- as.vector(t(bias_data[c("precise.airline.howMany.precise", "precise.states.howMany.precise")]))
precise_howMany_answer <- as.vector(t(bias_data[c("precise.airline.howMany.answer", "precise.states.howMany.answer")]))

how_many_precise$approximate_error <- (approx_howMany_answer - approx_howMany_approx)/ approx_howMany_approx
how_many_precise$expected_bias <- (precise_howMany_precise - approx_howMany_approx)/ precise_howMany_precise
how_many_precise$measured_bias <- (precise_howMany_precise - precise_howMany_answer)/ precise_howMany_precise

#One would hope we can remove: visType, focus, sequence, order
how_many_precise_test <- lm(measured_bias ~ expected_bias + approximate_error + visType + condition + focus + sequence + order + (1 | id), data=how_many_precise)

qplot(measured_bias, expected_bias, data=how_many_precise)