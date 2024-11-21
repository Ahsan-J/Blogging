import { Injectable, NotFoundException } from "@nestjs/common";
import { RegisterComponentRequest } from "./dto/register-component.dto";
import { PageRepository } from "./repository/page.repository";
import { ComponentRepository } from "./repository/component.repository";
import { PageResponse } from "./dto/page-response.dto";
import { Page } from "./entity/page.entity";
import { ComponentResponse } from "./dto/component-response.dto";

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

    async getPageByPageAlias(alias: Page['alias']): Promise<PageResponse> {
        const page = await this.pageRepository.findOne({where: { alias }});
        if(!page) throw new NotFoundException("Page not found");
        return new PageResponse().lazyFetch(page)
    }
}