import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Question, QuestionTypeEnum } from "./model";
import { faker } from "@faker-js/faker";

export class QuestionFactory extends BaseFactory<Question> {
  constructor(public params: { task_id?: string, exists?: boolean } = {}) {
    super()
  }

  public generate(): Question {
    const question = new Question()

    question.type        = faker.helpers.arrayElement(Object.values(QuestionTypeEnum))
    question.question    = `¿${faker.lorem.sentence()}?`
    question.description = faker.helpers.arrayElement([true, false]) ? faker.lorem.sentence() : ''
    question.points      = faker.number.int({ min: 1, max: 3 })

    if (typeof this.params.task_id == 'string') question.task_id = this.params.task_id
    if (typeof this.params.exists  == 'boolean') question.exists = this.params.exists

    return question
  }
}
