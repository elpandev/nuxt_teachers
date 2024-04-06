import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Question, QuestionTypeEnum } from "./model";
import { faker } from "@faker-js/faker";
import { QuestionOption } from "./values/option";

export class QuestionFactory extends BaseFactory<Question> {
  public generate(): Question {
    const question = new Question()

    question.type        = faker.helpers.arrayElement(Object.values(QuestionTypeEnum))
    question.question    = `¿${faker.lorem.sentence()}?`
    question.description = faker.helpers.arrayElement([true, false]) ? faker.lorem.sentence() : ''
    question.points      = faker.number.int({ min: 1, max: 3 })

    if (question.is_selector) {
      const options_count = faker.number.int({ min: 2, max: 5 })

      for (let ii = 0; ii < options_count; ii++) {
        const option = new QuestionOption()

        option.selected = ii == 0
        option.option   = faker.lorem.words({ min: 1, max: 6 })

        question.push_option(option)
      }
    }

    return question
  }
}
