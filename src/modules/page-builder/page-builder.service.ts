import { Injectable } from "@nestjs/common";
import { ComponentResponse, RegisterComponentRequest } from "./dto/register-component.dto";
import { PageRepository } from "./repository/page.repository";
import { ComponentRepository } from "./repository/page-component.repository";

@Injectable()
export class PageBuilderService {
    constructor(
        private pageRepository: PageRepository,
        private componentRepository: ComponentRepository,
    ) {}

    async registerComponent(newComponent: RegisterComponentRequest): Promise<ComponentResponse> {
        const component = await this.componentRepository.create({
            category: newComponent.category,
            identifier: newComponent.identifier,
            name: newComponent.name,
            thumbnail: newComponent.thumbnail,
            description: newComponent.description,
        })

        const savedComponent = await this.componentRepository.save(component);
        return new ComponentResponse(savedComponent)
    }
}