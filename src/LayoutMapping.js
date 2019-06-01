import Layouts from "simple-keyboard-layouts";

class LayoutMapping {
  constructor() {
    this.layouts = new Layouts();
    console.log("Available layouts", this.layouts);
  }

  init(keyboard) {
    /**
     * Registering module
     */
    keyboard.registerModule("layoutMapping", module => {
      let { sourceLayout, targetLayout } = keyboard.options;

      let sourceLayoutObj = this.layouts.get(sourceLayout);
      let targetLayoutObj = this.layouts.get(targetLayout);

      /**
       * Highlight button
       */
      module.highlightButton = event => {
        let physicalKeyboardKeyName = module.sourceLayoutKeyMaps(
          keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(event)
        );

        let sourceLayoutIndexes = module.getLayoutKeyIndex(
          physicalKeyboardKeyName,
          sourceLayoutObj
        );

        if (sourceLayoutIndexes) {
          let { rIndex, bIndex } = sourceLayoutIndexes;

          let layoutKeyName = module.findLayoutKeyByIndex(
            rIndex,
            bIndex,
            targetLayoutObj
          );

          let buttonElement = module.getButtonInLayout(layoutKeyName);

          if (!buttonElement) {
            console.log("Could not find button in layout", layoutKeyName);
            return false;
          }

          if (Array.isArray(buttonElement)) {
            buttonElement.forEach(item => {
              item.style.background = "#9ab4d0";
              item.style.color = "white";
            });

            /**
             * Trigger press
             */
            buttonElement[0].onpointerdown();
            buttonElement[0].onpointerup();
          } else {
            buttonElement.style.background = "#9ab4d0";
            buttonElement.style.color = "white";

            /**
             * Trigger press
             */
            buttonElement.onpointerdown();
            buttonElement.onpointerup();
          }
        }
      };

      /**
       * Unhighlight button
       */
      module.unhighlightButton = event => {
        let physicalKeyboardKeyName = module.sourceLayoutKeyMaps(
          keyboard.physicalKeyboardInterface.getSimpleKeyboardLayoutKey(event)
        );

        let sourceLayoutIndexes = module.getLayoutKeyIndex(
          physicalKeyboardKeyName,
          sourceLayoutObj
        );

        if (sourceLayoutIndexes) {
          let { rIndex, bIndex } = sourceLayoutIndexes;

          let layoutKeyName = module.findLayoutKeyByIndex(
            rIndex,
            bIndex,
            targetLayoutObj
          );

          let buttonElement = module.getButtonInLayout(layoutKeyName);

          if (!buttonElement) {
            console.log("Could not find button in layout", layoutKeyName);
            return false;
          }

          if (Array.isArray(buttonElement)) {
            buttonElement.forEach(item => {
              item.removeAttribute("style");
            });
          } else {
            buttonElement.removeAttribute("style");
          }
        }
      };

      /**
       * Get button in layout
       */
      module.getButtonInLayout = layoutKeyName => {
        let buttonElement =
          keyboard.getButtonElement(layoutKeyName) ||
          keyboard.getButtonElement(`{${layoutKeyName}}`);

        return buttonElement;
      };

      /**
       * Get layout key's index
       */
      module.getLayoutKeyIndex = (layoutKey, layout) => {
        try {
          let layoutName = keyboard.options.layoutName;
          layout[layoutName].forEach((row, rIndex) => {
            let rowButtons = row.split(" ");

            rowButtons.forEach((button, bIndex) => {
              if (button === layoutKey) {
                throw {
                  rIndex,
                  bIndex
                };
              }
            });
          });

          return false;
        } catch (res) {
          return res;
        }
      };

      /**
       * Find layout key by index
       */
      module.findLayoutKeyByIndex = (rIndex, bIndex, layout) => {
        let layoutName = keyboard.options.layoutName;
        let row = layout[layoutName][rIndex];

        if (row) {
          let rowButtons = row.split(" ");
          return rowButtons[bIndex];
        }
      };

      /**
       * Define key listeners
       */
      module.initListeners = () => {
        /**
         * Handle keyboard press
         */
        document.addEventListener("keydown", event => {
          module.highlightButton(event);
        });

        document.addEventListener("keyup", event => {
          module.unhighlightButton(event);
        });
      };

      /**
       * Custom layout overrides
       */
      module.sourceLayoutKeyMaps = keyName => {
        let retval;
        switch (keyName) {
          case "backspace":
            retval = "{bksp}";
            break;

          case "shiftleft":
            retval = "{shift}";
            break;

          case "shiftright":
            retval = "{shift}";
            break;

          case "space":
            retval = "{space}";
            break;

          case "enter":
            retval = "{enter}";
            break;

          default:
            retval = keyName;
            break;
        }

        return retval;
      };

      /**
       * Start module
       */
      module.start = () => {
        module.initListeners();
        keyboard.setOptions({
          layout: targetLayoutObj
        });
      };

      module.start();
    });
  }
}

export default LayoutMapping;
