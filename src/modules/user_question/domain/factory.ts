import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { UserQuestion } from "./model";
import { faker } from "@faker-js/faker";

export class UserQuestionFactory extends BaseFactory<UserQuestion> {
  constructor(public params: { task_id?: string, question_id?: string, exists?: boolean } = {}) {
    super()
  }

  public generate(): UserQuestion {
    const user_question = new UserQuestion()

    user_question.answer  = faker.lorem.sentence()
    user_question.comment = faker.lorem.sentence()
    user_question.points  = faker.number.int({ min: 1, max: 3 })

    if (typeof this.params.task_id     == 'boolean') user_question.task_id     = this.params.task_id
    if (typeof this.params.question_id == 'boolean') user_question.question_id = this.params.question_id
    if (typeof this.params.exists      == 'boolean') user_question.exists      = this.params.exists

    return user_question
  }
}
