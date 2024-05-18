import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { UserQuestion } from "./model";
import { faker } from "@faker-js/faker";

export class UserQuestionFactory extends BaseFactory<UserQuestion> {
  public generate(): UserQuestion {
    const user_question = new UserQuestion()

    user_question.answer  = faker.lorem.sentence()
    user_question.comment = faker.lorem.sentence()
    user_question.points  = faker.number.int({ min: 1, max: 3 })

    return user_question
  }
}
