import * as React from 'react';
import {
    observer,
} from 'mobx-react';

import {
    RuleGroup,
    Rule,
} from '../../defs/rule-definition';
import {
    TranslationFunction,
} from '../../i18n';
import {
    bind,
} from '../../util/bind';
import {
    CachedBinder,
} from '../../util/cached-binder';

import {
    CheckboxControl,
    IntegerControl,
    SelectControl,
    TimeControl,
    Separator,
} from './rule';
import {
    RuleSetGroup,
} from './group';

export interface IPropRuleControl {
    t: TranslationFunction;
    ruledefs: RuleGroup;
    ruleObject: Rule,
    onUpdate: (rule: string, value: string)=> void;
}
/**
 * Interface of editing rules.
 */
@observer
export class RuleControl extends React.Component<IPropRuleControl, {}> {
    protected updateHandlers = new CachedBinder<string, string, void>();
    public render(): JSX.Element {
        const {
            t,
            ruledefs,
            ruleObject,
            onUpdate,
        } = this.props;
        const {
            rules,
        } = ruleObject;

        return (<>{
            ruledefs.map((rule, i)=> {
                if (rule.type === 'group') {
                    const {
                        id,
                        visible,
                    } = rule.label;
                    const vi = visible(ruleObject);
                    if (vi) {
                        return (<RuleSetGroup
                            key={`group-${id}`}
                            name={t(`game_client:ruleGroup.${id}.name`)}
                        >
                            <RuleControl
                                t={t}
                                ruledefs={rule.items}
                                ruleObject={ruleObject}
                                onUpdate={onUpdate}
                            />
                        </RuleSetGroup>);
                    } else {
                        return null;
                    }
                } else {
                    const {
                        value,
                    } = rule;
                    switch (value.type) {
                        case 'separator': {
                            return (<Separator key={`separator-${i}`} />);
                        }
                        case 'hidden': {
                            return null;
                        }
                        case 'checkbox': {
                            const cur = rules.get(value.id)!;
                            const onChange = this.updateHandlers.bind(value.id, this.handleChange);
                            return (<CheckboxControl
                                key={`item-${value.id}`}
                                t={t}
                                item={value}
                                value={cur}
                                onChange={onChange}
                            />);
                        }
                        case 'integer': {
                            const cur = rules.get(value.id)!;
                            const onChange = this.updateHandlers.bind(value.id, this.handleChange);
                            return (<IntegerControl
                                key={`item-${value.id}`}
                                t={t}
                                item={value}
                                value={cur}
                                onChange={onChange}
                            />);
                        }
                        case 'select': {
                            const cur = rules.get(value.id)!;
                            const onChange = this.updateHandlers.bind(value.id, this.handleChange);
                            return (<SelectControl
                                key={`item-${value.id}`}
                                t={t}
                                item={value}
                                value={cur}
                                onChange={onChange}
                            />);
                        }
                        case 'time': {
                            const cur = rules.get(value.id)!;
                            const onChange = this.updateHandlers.bind(value.id, this.handleChange);
                            return (<TimeControl
                                key={`item-${value.id}`}
                                t={t}
                                item={value}
                                value={cur}
                                onChange={onChange}
                            />);
                        }
                    }
                }
            })
        }</>);
    }
    @bind
    protected handleChange(rule: string, value: string): void {
        this.props.onUpdate(rule, value);
    }
}

